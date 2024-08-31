const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, PermissionFlagsBits, ActivityType, TextInputBuilder, TextInputStyle, PermissionsBitField, WebhookClient } = require("discord.js")
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { randomizer } = require("../functions/utils.js");
const config = require("../config.js");
const { webhookSend } = require("../functions/webhook.js");

module.exports = {
  name: "ready",
  run: async (client) => {

    client.user.setPresence({
      activities: [{ name: `🔮 Everything is being optimized for you...`, type: ActivityType.Custom, url: "https://www.twitch.tv/beftli" }]
    });

    setInterval(async () => {

      client.user.setPresence({
        activities: [{ name: `${await randomizer(config.bot.statusMessages)}`, type: ActivityType.Custom, url: "https://www.twitch.tv/beftli" }]
      });

    }, 600000)

    const globalCommands = Array.from(client.commands.filter((cmd) => cmd.global === true).values()).map((m) => m.data);

    const rest = new REST({ version: "10" }).setToken(client.token);

    await rest.put(Routes.applicationCommands(client.user.id), { body: globalCommands }).catch(console.error);

    var uptime = Date.now() - (Math.round(process.uptime()) * 1000);

    await webhookSend(config.webhook.status, {
      author: { name: `Bot Online!`, iconURL: 'https://cdn.discordapp.com/emojis/1196518475275960330.png' },
      description: `## Launch time \n<t:${(uptime - (uptime % 1000)) / 1000}> ( **<t:${(uptime - (uptime % 1000)) / 1000}:R>** )`,
      thumbnail: client.user.displayAvatarURL(),
      footer: { text: client.user.username, iconURL: client.user.displayAvatarURL() },
      color: "Green"
    })

    require("../helpers/blacklistCheck.js")(client);

    console.log(`CHECKER | Blacklist check successfully launched.`)

    console.log(`BOT | ${client.user.tag} is online.`);

  }

}