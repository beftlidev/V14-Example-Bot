const Discord = require('discord.js')
const { Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, EmbedBuilder, WebhookClient } = require("discord.js")

const { emoji, emojiId } = require("../config.js")
const { BlackList } = require('./databases.js')
const config = require('../config.js')

module.exports = async (client) => {

  setInterval(async() => {

    const data = Object.entries(BlackList.fetch("blacklistedUsers"))
    if(data.length == 0) return;

    data.forEach(async(i) => {

      if(Date.now() > i[1].endDate) {

        await BlackList.delete(`blacklistedUsers.${i[0]}`)

      }

    })

  }, 300000)

}