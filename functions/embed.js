const Discord = require('discord.js')
const {Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, EmbedBuilder, WebhookClient,PermissionsBitField} = require("discord.js")

const { emoji, emojiId } = require("../config.js")

async function createEmbed(data = {}) {

    const embed = new EmbedBuilder()
    if(data.authorIconURL) embed.setAuthor({ name: data.authorName, iconURL: data.authorIconURL }); else embed.setAuthor({ name: data.authorName });
    if(data.title) embed.setTitle(data.title);
    if(data.url) embed.setURL(data.url);
    if(data.description) embed.setDescription(data.description);
    if(data.thumbnail) try { embed.setThumbnail(data.thumbnail); } catch {}
    if(data.fields) embed.setFields(data.fields)
    if(data.footerIconURL) embed.setFooter({ text: data.footerText, iconURL: data.footerIconURL }); else if(data.footerText) embed.setFooter({ text: data.footerText });
    if(data.color) embed.setColor(data.color)
    if(data.timestamp == "yes") embed.setTimestamp();
    if(data.image.data !== "no") embed.setImage(data.image.image)

    return embed;

}

async function createRowEmbed(data = {author, description, fields, footer, color}) {

    const embed = new EmbedBuilder()
    if(data.author) embed.setAuthor(data.author)
    if(data.description) embed.setDescription(data.description)
    if(data.fields) embed.addFields(data.fields)
    if(data.footer) embed.setFooter(data.footer)
    if(data.color) embed.setColor(data.color)

    return embed;

}

async function successEmbed(data = { description, fields }) {

    const embed = new EmbedBuilder()
    .setAuthor({ name: "Okay!", iconURL: `https://cdn.discordapp.com/emojis/${emojiId.checkmark}.png` })
    .setDescription(`> ${data.description}`)
    .setColor("Green")

    if(data.fields) embed.addFields(data.fields)

    return embed;

}

async function errorEmbed(data = { description, fields }) {

    const embed = new EmbedBuilder()
    .setAuthor({ name: "Opss...", iconURL: `https://cdn.discordapp.com/emojis/${emojiId.cross}.png` })
    .setDescription(`> ${data.description}`)
    .setColor("Red")

    if(data.fields) embed.addFields(data.fields)
        
    return embed;
    
}

async function infoEmbed(data = { description, fields }) {

    const embed = new EmbedBuilder()
    .setAuthor({ name: "Hey, one second.", iconURL: `https://cdn.discordapp.com/emojis/${emojiId.info}.png` })
    .setDescription(`> ${data.description}`)
    .setColor("Yellow")

    if(data.fields) embed.addFields(data.fields)
        
    return embed;

}

async function loadingEmbed(data = { description, fields }) {

    const embed = new EmbedBuilder()
    .setAuthor({ name: "Wait...", iconURL: `https://cdn.discordapp.com/emojis/${emojiId.loading}.gif` })
    .setDescription(`> ${data.description}`)
    .setColor("Blurple")

    if(data.fields) embed.addFields(data.fields)
        
    return embed;

}

async function cooldownEmbed(data = { description, fields }) {

    const embed = new EmbedBuilder()
    .setAuthor({ name: "Slow down!", iconURL: `https://cdn.discordapp.com/emojis/${emojiId.cooldown}.png` })
    .setDescription(`> ${data.description}`)
    .setColor("Orange")

    if(data.fields) embed.addFields(data.fields)
        
    return embed;

}

async function invisibleEmbed(data = { description, fields }) {

    const embed = new EmbedBuilder()
    .setDescription(`> ${data.description}`)
    .setColor("#2b2d31")

    if(data.fields) embed.addFields(data.fields)
        
    return embed;

}

module.exports = {
    createEmbed,
    createRowEmbed,
    successEmbed,
    errorEmbed,
    infoEmbed,
    loadingEmbed,
    cooldownEmbed,
    invisibleEmbed
} 