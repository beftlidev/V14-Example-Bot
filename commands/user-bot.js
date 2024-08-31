const Discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } = require("discord.js")
const { SlashCommandBuilder, time: timestamp } = require("@discordjs/builders");
const { support, voteMe, website, link } = require('../functions/button');
const { emoji, emojiId } = require("../config.js");
const config = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bot")
        .setDescription("🤖 There are commands about the bot.")
        .addSubcommand(option =>
            option.setName("about")
                .setDescription("🤖 You get information about the bot.")),
    global: true,
    commandAuthType: "User",
    maintenance: false,
    run: async (client, interaction) => {

        await interaction.deferReply()

        const sub = interaction.options.getSubcommand()

        if (sub == "about") {

            const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: "About Me", iconURL: client.user.displayAvatarURL({ extension: 'png' }) })
                .setDescription(`Hello, I'm **BOT**. My owner <@${config.bot.owner}> (\`beftli\`), you can reach him if you have any suggestions, requests or if there is an error in the bot.`)
                .addFields([
                    { name: `• Stats`, value: `🌍 Total Servers: **${client.guilds.cache.size}** \n🤝 Total Users: **${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}** \n⏰ Ping: **${client.ws.ping} ms** \n✨ Bot Version: **${config.bot.version}**` }
                ])
                .setColor("Blurple")
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }) })

            const row = new ActionRowBuilder()
                .addComponents(
                    await website({ type: "button" }),
                    await voteMe({ type: "button" }),
                    await support({ type: "button" })
                )

            interaction.editReply({ 
                embeds: [embed], 
                components: [row] 
            })

        }

    }
}