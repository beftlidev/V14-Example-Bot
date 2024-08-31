const Discord = require('discord.js')
const { Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, EmbedBuilder, PermissionsBitField, WebhookClient } = require("discord.js")
const axios = require("axios")
const ms = require('ms');
const { errorEmbed } = require("./embed")
const { support } = require("./button")
const config = require("../config.js")

const { emoji, emojiId } = require("../config.js");
const { webhookSend } = require('./webhook.js');
const { CoolDown } = require('../helpers/databases.js');

async function randomizer(data) {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

function formatTime(number) {
    return number < 10 ? `0${number}` : `${number}`;
}

function getCurrentTime() {
    const now = new Date();
    const hours = formatTime(now.getHours());
    const minutes = formatTime(now.getMinutes());
    const seconds = formatTime(now.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
}

class cooldown {

    async fetch(userId, system) {

        if (await CoolDown.fetch(`${userId}.${system}`)) {
            const data = await CoolDown.fetch(`${userId}.${system}`)
            if (Date.now() > data.endTime) {
                return {
                    ended: "true"
                }
            } else {
                return {
                    ended: "false",
                    endTimestamp: `<t:${(data.endTime / 1000).toFixed(0)}:R>`
                }
            }
        } else {
            return {
                ended: "noCooldown"
            }
        }

    }

    async set(userId, system, time) {

        await CoolDown.set(`${userId}.${system}.endTime`, Date.now() + ms(time))
        return true

    }

}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateRandom(max = 20) {

    let text = "abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz34567890abcdefghijklmnefghijklmnopqrstz";
    let randomid = "";

    for (let i = 0; i < max; i++) {
        random = (Math.random() * 100).toFixed();
        randomid = randomid + text[random];
    }

    return randomid;

}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sendErrorReport(client, interaction, command, commandName, error) {

    await webhookSend(config.webhook.error, {
        author: { name: `An error has occurred in the ${command}!`, iconURL: `https://cdn.discordapp.com/emojis/${emojiId.info}.png` },
        description: `\`\`\`js\n${error.stack > 4096 ? error.stack.slice(0, 4096) + '...' : error.stack}\`\`\``,
        fields: [
            { name: "User ID", value: interaction.user.id, inline: true },
            { name: "Server", value: `${interaction.guild.name} ( \`${interaction.guild.id}\` )`, inline: true },
            { name: "Command Name", value: commandName, inline: true }
        ],
        footer: { text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: 'png' }) },
        color: "Orange"
    })

    if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
            embeds: [
                await errorEmbed({
                    description: `An error has occurred! The error has been forwarded to our competent team and will be resolved as soon as possible. You can come to our support server to stay up to date.`
                })
            ],
            components: [
                await support({ type: "row" })
            ],
            ephemeral: true
        })
    } else {
        await interaction.reply({
            embeds: [
                await errorEmbed({
                    description: `An error has occurred! The error has been forwarded to our competent team and will be resolved as soon as possible. You can come to our support server to stay up to date.`
                })
            ],
            components: [
                await support({ type: "row" })
            ],
            ephemeral: true
        })
    }

}

module.exports = {
    randomizer,
    shuffle,
    getCurrentTime,
    cooldown,
    wait,
    generateRandom,
    getRandomNumber,
    sendErrorReport
}