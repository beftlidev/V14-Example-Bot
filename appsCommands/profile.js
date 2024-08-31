const Discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle, ApplicationCommandType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js")
const addModal = require("../helpers/addModal.js")

const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const { errorEmbed } = require('../functions/embed.js');
const { emoji, emojiId } = require("../config.js");
const { Profile } = require('../helpers/databases.js');
const config = require('../config.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Profile")
        .setType(ApplicationCommandType.User),
    global: true,
    commandAuthType: "User",
    maintenance: false,
    run: async (client, interaction) => {

        await interaction.deferReply({
            ephemeral: true
        })

        const user = client.users.cache.get(interaction.targetId)

        if (interaction.user.id !== user.id && await Profile.fetch(`${user.id}.private`) == "true") {

            return interaction.editReply({
                embeds: [
                    await errorEmbed({
                        description: `You can't see the profile of the person you want to see because they have hidden their profile.`
                    })
                ]
            })

        }

        const dcdate = interaction.guild.members.cache.get(user.id).user.createdAt.getTime()
        const serverdate = interaction.guild.members.cache.get(user.id).joinedAt.getTime()

        const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${user.username}'s profile` })
            .setThumbnail(user.displayAvatarURL())
            .setColor("Blurple")
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Avatar URL")
                    .setURL(`${user.displayAvatarURL()}`)
            )

        const banner = await user.fetch({ force: true }).then(async (uss) => { return uss.banner })

        if (banner) {
            const extension = banner.startsWith("a_") ? ".gif" : ".png";
            embed.setImage(`https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=4096`)
            row.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Banner URL").setURL(`https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=4096`))
        }

        embed.addFields([
            { name: "Date of Discord account opening", value: `<t:${(dcdate - (dcdate % 1000)) / 1000}> ( <t:${(dcdate - (dcdate % 1000)) / 1000}:R> )` },
            { name: "Date of joining the server", value: `<t:${(serverdate - (serverdate % 1000)) / 1000}> ( <t:${(serverdate - (serverdate % 1000)) / 1000}:R> )` },
        ])

        interaction.editReply({
            embeds: [embed],
            components: [row]
        })

    }
}