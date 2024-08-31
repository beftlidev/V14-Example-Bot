const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle, PermissionsBitField } = require("discord.js");
const { errorEmbed, infoEmbed } = require("../functions/embed");
const { support, invite } = require("../functions/button");
const { sendErrorReport } = require("../functions/utils");
const config = require("../config");
const { BlackList } = require("../helpers/databases");

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {

    if (!interaction.isContextMenuCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) return

    if (interaction.guild == null) {
      return interaction.reply({
        embeds: [
          await errorEmbed({
            description: `Hey, you can't use my commands over DM.`
          })
        ],
        ephemeral: true
      })
    }

    if (await BlackList.fetch(`blacklistedUsers.${interaction.user.id}`)) {
      const data = await BlackList.fetch(`blacklistedUsers.${interaction.user.id}`)
      return interaction.reply({
        embeds: [
          await errorEmbed({
            description: `Hey, you can't use my commands because you're blacklisted! If you have any objections, you can talk to the authorities on our support server.`,
            fields: [{ name: "❓ Reason", value: `${data.reason}`, inline: true }, { name: "⏰ End Date", value: `<t:${(data.endDate / 1000).toFixed(0)}> ( <t:${(data.endDate / 1000).toFixed(0)}:R> )`, inline: true },]
          })
        ],
        components: [
          await support({ type: "row" })
        ],
        ephemeral: true
      })
    }

    if (command.maintenance) {
      return interaction.reply({
        embeds: [
          await infoEmbed({
            description: `This command is unavailable for maintenance! You can come to our support server to follow the developments.`
          })
        ],
        components: [
          await support({ type: "row" })
        ],
        ephemeral: true
      })
    }


    if (command.commandAuthType == "User") {

      if (!client.channels.cache.get(interaction.channel.id).guild.members.me.permissionsIn(interaction.channel.id).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles])) {

        return interaction.reply({
          embeds: [
            await errorEmbed({
              description: `Hey, one or both of \`SendMessages, AttachFiles\` authorisations are not available in this channel. Therefore, commands are restricted on this channel. Please contact an authorised person.`
            })
          ],
          ephemeral: true
        })

      }

    } else if (command.commandAuthType == "Admin") {

      if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {

        return interaction.reply({
          embeds: [
            await errorEmbed({
              description: `Hey, I don't have \`Administrator\` privileges on the server. This is why Admin commands are restricted on this server. Let's fix this!`,
              fields: [
                { name: "📖 Solution 1", value: `In the roles section of the server settings, check if the \`BOT\` role or the custom role you gave me has \`Administrator\` privileges.` },
                { name: "📖 Solution 2", value: `Remove me from the server and add me back by pressing the button below.` }
              ]
            })
          ],
          components: [
            await invite({ type: "row" })
          ],
          ephemeral: true
        })

      }

    }

    try {
      await command.run(client, interaction)
    } catch (e) {
      await sendErrorReport(client, interaction, "apps command", interaction.commandName, e)
    }

  }
}