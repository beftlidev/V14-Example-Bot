const Discord = require('discord.js');
const {ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle} = require("discord.js")
const addModal = require("../helpers/addModal.js")

const { SlashCommandBuilder } = require("@discordjs/builders");
const { cooldown } = require('../functions/utils.js');
const { successEmbed, errorEmbed, cooldownEmbed } = require('../functions/embed.js');
const { emoji, emojiId } = require("../config.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("⏰ Update the channel's slow mode.")
    .addStringOption(option =>
        option.setName("duration")
        .setDescription("How many seconds of slowmode do you want to put on the channel? Please specify in seconds.")
        .setRequired(true))
        .addChannelOption(option =>
            option.setName("channel")
            .setDescription("If you want to put slowmode on another channel, specify the channel."))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    global: true,
    commandAuthType: "Admin",
    maintenance: false,
    run: async (client, interaction) => {

        await interaction.deferReply()

        const duration = interaction.options.getString("duration")
        const kanal = interaction.options.getChannel("channel")
        const k = kanal || interaction.channel

        const Cooldown = new cooldown()

        const CoolDown = await Cooldown.fetch(`server_${interaction.guild.id}`, "slowMode")

        if(CoolDown.ended == "false") {
            return interaction.editReply({
                embeds: [
                    await cooldownEmbed({
                        description: `You can use this command every **5 seconds** on the server.`,
                        fields: [{name: `⏰ Time to reuse`, value: `${CoolDown.endTimestamp}`}]
                    })
                ]
            })
        }

        await Cooldown.set(`server_${interaction.guild.id}`, "slowMode", "5s")

        if(!k.type == 0) {
            return interaction.editReply({
                embeds: [
                    await errorEmbed({
                        description: `The selected channel is not text-based.`
                    })
                ]
            })
        }

        if(!Number(duration)) {
            return interaction.editReply({
                embeds: [
                    await errorEmbed({
                        description: `Please specify the duration in seconds.`
                    })
                ]
            })
        }

        if(Number(duration) < 1 || Number(duration) > 21600) {
            return interaction.editReply({
                embeds: [
                    await errorEmbed({
                        description: `Please specify a minimum of 1 second and a maximum of 21600 seconds.`
                    })
                ]
            })
        }

        k.setRateLimitPerUser(duration)

        interaction.editReply({
            embeds: [
                await successEmbed({
                    description: `<#${k.id}> channel successfully set to slowmode **${duration}** seconds.`
                })
            ]
        })

} 
}