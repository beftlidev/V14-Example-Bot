const Discord = require('discord.js')
const { Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, EmbedBuilder, WebhookClient } = require("discord.js")
const { getCurrentTime, wait } = require('../functions/utils');
const config = require('../config');
const { postStats } = require('../functions/topGG');

module.exports = async (client) => {

    if(!config.token.topGG) return;

    async function topgg() {

        setTimeout(async () => {

            const poster = await postStats(client)
            if(!poster) console.log(`TOP.GG | ( ${getCurrentTime()} ) Error posting stats to TopGG.`);
                else console.log(`TOP.GG | ( ${getCurrentTime()} ) Posted stats to TopGG.`);
            await wait(5000)
            await topgg()

        }, 3600000)

    }

    await topgg()

}