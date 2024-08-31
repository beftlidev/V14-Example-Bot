const Discord = require('discord.js')
const { Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, EmbedBuilder, WebhookClient, PermissionsBitField } = require("discord.js")

async function invite({ type = "row" } = {}) {

    const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL("https://kitty.mert.lol/invite")
        .setLabel("Invite")

    if (type == "row") {
        return new ActionRowBuilder()
            .addComponents(
                button
            )
    } else if (type == "button") {
        return button
    }

}

async function voteMe({ type = "row" } = {}) {

    const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL("https://top.gg/bot/1149967648248057897/vote")
        .setLabel("Vote Me")

    if (type == "row") {
        return new ActionRowBuilder()
            .addComponents(
                button
            )
    } else if (type == "button") {
        return button
    }

}

async function support({ type = "row" } = {}) {

    const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/TCWbk7zWY5")
        .setLabel("Support Server")

    if (type == "row") {
        return new ActionRowBuilder()
            .addComponents(
                button
            )
    } else if (type == "button") {
        return button
    }

}

async function website({ label = "Website", type = "row" } = {}) {

    const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL("https://kitty.mert.lol/")
        .setLabel(label)

    if (type == "row") {
        return new ActionRowBuilder()
            .addComponents(
                button
            )
    } else if (type == "button") {
        return button
    }

}

async function link({ label = "Link", type = "row", link = "https://kitty.mert.lol/", emoji }) {

    const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(link)
        .setLabel(label)

    if(emoji) button.setEmoji(emoji);

    if (type == "row") {
        return new ActionRowBuilder()
            .addComponents(
                button
            )
    } else if (type == "button") {
        return button
    }
    
}

module.exports = {
    invite,
    voteMe,
    support,
    website,
    link
} 