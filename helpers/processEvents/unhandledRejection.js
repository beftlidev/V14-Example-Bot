const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle, PermissionsBitField } = require("discord.js")

const { emoji, emojiId } = require("../../config.js");
const { webhookSend } = require("../../functions/webhook.js");
const config = require("../../config.js");

module.exports = {
    name: "unhandledRejection",
    run: async (client, reason) => {

        await webhookSend(config.webhook.error, {
            author: { name: `An error has occurred!`, iconURL: `https://cdn.discordapp.com/emojis/${emojiId.info}.png` },
            description: `\`\`\`js\n${reason.stack.length > 4096 ? reason.stack.slice(0, 4096) + '...' : reason.stack}\`\`\``,
            footer: { text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: 'png' }) },
            color: "Orange"
        })

        console.log("ERROR | Uncaught Rejection: ", reason)

    }
}