const Discord = require('discord.js')
const { Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, EmbedBuilder, WebhookClient, PermissionsBitField } = require("discord.js")

async function webhookSend(webhook, data = { author, title, description, fields, thumbnail, image, footer, color }) {

    const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });

    const embed = new EmbedBuilder()

    if(data.author) embed.setAuthor(data.author);
    if(data.title) embed.setTitle(data.title);
    if(data.description) embed.setDescription(data.description);
    if(data.fields) embed.setFields(data.fields);
    if(data.thumbnail) embed.setThumbnail(data.thumbnail);
    if(data.image) embed.setImage(data.image);
    if(data.footer) embed.setFooter(data.footer);
    if(data.color) embed.setColor(data.color);

    webhookClient.send({
        embeds: [embed]
    });

}

module.exports = {
    webhookSend
} 