const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle, PermissionsBitField, WebhookClient } = require("discord.js")
const Util = require('util')

const { successEmbed, errorEmbed } = require("../functions/embed.js");
const { emoji, emojiId } = require("../config.js");
const config = require("../config.js");
const { webhookSend } = require("../functions/webhook.js");
const {  BlackList } = require("../helpers/databases.js");

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {

    if (message.author.bot) return;

    if (message.content == "hey bot") {

      if (message.author.id !== config.bot.owner) return;

      const embed = new EmbedBuilder()
        .setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
        .setDescription(`# Welcome to the Developer Menu. \n- 🖋️ Eval \`/\` Run a code. \n- 🔃 Reload \`/\` Reload the bot. \n- 🖤 Blacklist \`/\` User blacklist management.`)
        .setFooter({ text: `There are now ${client.guilds.cache.size} servers and ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} users using me!` })
        .setColor("Orange")

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("dev-eval")
            .setLabel("Eval")
            .setEmoji("🖋️"),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("dev-reload")
            .setLabel("Reload")
            .setEmoji("🔃"),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("dev-blacklist")
            .setLabel("Blacklist")
            .setEmoji("🖤")
        )

      await message.reply({
        embeds: [embed],
        components: [row]
      }).then(async (msg) => {

        const filter = (interact) => interact.user.id === message.author.id;

        const collector = msg.createMessageComponentCollector({ filter, time: 1800000 });

        collector.on("collect", async (i) => {

          if (i.customId == "dev-eval") {

            await i.deferUpdate()

            msg.edit({
              embeds: [new Discord.EmbedBuilder().setAuthor({ name: `Waiting for code to run...`, iconURL: `https://cdn.discordapp.com/emojis/${emojiId.loading}.gif` }).setColor("Blurple").setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ extension: 'png' }) })],
              components: []
            }).then(async (m) => {

              const evalFilter = (interact) => interact.author.id === message.author.id;

              const evalCollector = m.channel.createMessageCollector({ evalFilter, time: 1800000 });

              evalCollector.on("collect", async (ii) => {

                if (ii.author.id !== message.author.id) return;

                ii.delete()

                var args = ii.content.split(" ")

                let arguman = args.join(" ");

                let executedIn = process.hrtime();
                function clean(msg) {
                  if (typeof msg !== "string")
                    msg = Util.inspect(msg, { depth: 0 });
                  msg = msg
                    .replace(/`/g, "`" + String.fromCharCode(8203))
                    .replace(/@/g, "@" + String.fromCharCode(8203));
                  executedIn = process.hrtime(executedIn);
                  executedIn = executedIn[0] * Math.pow(10, 3) + executedIn[1] / Math.pow(10, 6);
                  return msg
                }

                const roww = new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                      .setStyle(ButtonStyle.Secondary)
                      .setEmoji("🖋️")
                      .setLabel("Run Code")
                      .setCustomId(`dev-eval`)
                  )

                try {

                  const evaled = clean(await eval(arguman));
                  const embddddd = new Discord.EmbedBuilder()
                    .setTitle("🥳 Code executed successfully.")
                    .setDescription(`# The code snippet was executed in \`${executedIn.toFixed(3)} ms\` \n- The code contains \`${arguman.length}\` characters in total. \n- The code contains \`${arguman.split("\n").length}\` lines in total.`)
                    .setColor("Green")
                  const embdddddd = new Discord.EmbedBuilder()
                    .setDescription(`\`\`\`js\n${arguman}\`\`\``)
                    .setColor("Green")
                  const embddddddd = new Discord.EmbedBuilder()
                    .setDescription(`\`\`\`js\n${evaled}\`\`\``)
                    .setColor("Green")


                  msg.edit({
                    embeds: [embddddd, embdddddd, embddddddd],
                    components: [roww]
                  });

                } catch (err) {

                  msg.edit({
                    embeds: [
                      new Discord.EmbedBuilder()
                        .setTitle("🤯 There was a mistake.")
                        .setColor("Red"),
                      new Discord.EmbedBuilder()
                        .setDescription(`\`\`\`js\n${arguman}\`\`\``)
                        .setColor("Red"),
                      new Discord.EmbedBuilder()
                        .setDescription(`\`\`\`js\n${err}\`\`\``)
                        .setColor("Red")

                    ],
                    components: [roww]
                  });

                }

                evalCollector.stop();

              })

            })

          }

          if (i.customId == "dev-reload") {

            await i.deferUpdate()

            msg.edit({
              embeds: [new Discord.EmbedBuilder().setAuthor({ name: `Restarting all systems...`, iconURL: `https://cdn.discordapp.com/emojis/${emojiId.loading}.gif` }).setColor("Blurple").setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ extension: 'png' }) })],
              components: []
            })

            try {

              console.log()
              console.log()
              console.log()

              console.log(`RELOAD | All systems are restarting...`)

              console.log()

              client.removeAllListeners();
              client.commands.clear()

              require("../utils/appsLoader.js")(client, "true");
              require("../utils/slashLoader.js")(client, "true");
              require("../utils/eventLoader.js")(client, "true");
              require("../utils/functionLoader.js")(client, "true");

              console.log(`BOT | ${client.user.tag} is restarted.`);

              await webhookSend(config.webhook.status, {
                author: { name: `Bot Restarted!`, iconURL: 'https://cdn.discordapp.com/emojis/1196518475275960330.png' },
                description: `## The person who restarts \n${message.author} ( \`\`${message.author.username}\`\` ) \n## Restart time \n**<t:${(Date.now() - (Date.now() % 1000)) / 1000}>** ( **<t:${(Date.now() - (Date.now() % 1000)) / 1000}:R>** )`,
                thumbnail: client.user.displayAvatarURL(),
                footer: { text: client.user.username, iconURL: client.user.displayAvatarURL() },
                color: "Green"
              })

              msg.edit({
                embeds: [
                  await successEmbed({
                    description: `All systems have been successfully restarted.`
                  })
                ],
                components: []
              })

            } catch (e) {

              msg.edit({
                embeds: [
                  await errorEmbed({
                    description: `There was a problem restarting all systems.`
                  })
                ],
                components: []
              })

            }

          }

          if (i.customId == "dev-blacklist") {

            await i.deferUpdate()

            msg.edit({
              embeds: [new Discord.EmbedBuilder().setAuthor({ name: `Waiting for person id or tag for blacklist information...`, iconURL: `https://cdn.discordapp.com/emojis/${emojiId.loading}.gif` }).setColor("Blurple").setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ extension: 'png' }) })],
              components: []
            }).then(async (m) => {

              const blacklistCollector = m.channel.createMessageCollector({ time: 1800000 });

              blacklistCollector.on("collect", async (ii) => {

                if (ii.author.id !== message.author.id) return;

                ii.delete()

                var args = ii.content.split(" ").slice(0)
                const user = ii.mentions.users.first() ? ii.mentions.users.first().id : args[0]

                const data = await BlackList.fetch(`blacklistedUsers.${user}`)

                const blEmbed = new EmbedBuilder()
                  .setAuthor({ name: "About user blacklist with id " + user })

                const blRow = new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                      .setStyle(ButtonStyle.Secondary)
                      .setCustomId(`blacklist-add_${user}`)
                      .setLabel("Add")
                      .setEmoji("➕"),
                    new ButtonBuilder()
                      .setStyle(ButtonStyle.Primary)
                      .setCustomId(`blacklist-edit_${user}`)
                      .setLabel("Edit")
                      .setEmoji("🖋️"),
                    new ButtonBuilder()
                      .setStyle(ButtonStyle.Secondary)
                      .setCustomId(`blacklist-remove_${user}`)
                      .setLabel("Remove")
                      .setEmoji("➖")
                  )

                if (data) {
                  blEmbed.setTitle(`${emoji.checkmark} This user is blacklisted.`)
                  blEmbed.setDescription(`# 🥍 Reason \n${data.reason}`)
                  blEmbed.addFields([
                    { name: "⏰ Date added", value: `<t:${(data.blacklistedTime / 1000).toFixed(0)}>`, inline: true },
                    { name: "⏰ End Date", value: `<t:${(data.endDate / 1000).toFixed(0)}> ( <t:${(data.endDate / 1000).toFixed(0)}:R> )`, inline: true },
                    { name: "❓ Who added", value: `<@${data.whoBlacklisted}>`, inline: true }
                  ])
                  blEmbed.setColor("Orange")
                  blRow.components[0].setDisabled(true)
                } else {
                  blEmbed.setTitle(`${emoji.cross} This user is not on the blacklist.`)
                  blEmbed.setColor("Red")
                  blRow.components[1].setDisabled(true)
                  blRow.components[2].setDisabled(true)
                }

                m.edit({
                  embeds: [blEmbed],
                  components: [blRow]
                })

                blacklistCollector.stop()

              })

            })

          }

        })

      })

    }

  }
}