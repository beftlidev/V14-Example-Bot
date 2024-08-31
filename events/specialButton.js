const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle, PermissionsBitField } = require("discord.js")

const ms = require("ms")
const addModal = require("../helpers/addModal.js");
const { successEmbed, errorEmbed } = require("../functions/embed.js");
const { BlackList, Profile } = require("../helpers/databases.js");
const config = require("../config.js");

module.exports = {
    name: "interactionCreate",
    run: async (client, i) => {

        if (i.isButton()) {

            if(i.customId.startsWith("privateProfile_")) {

                await i.deferUpdate()

                const id = i.customId.replace("privateProfile_", "")

                if(i.user.id !== id) {

                    return i.followUp({
                        embeds: [
                            await errorEmbed({
                                description: `You cannot use this button because you did not use this command.`
                            })
                        ],
                        ephemeral: true
                    })

                }

                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`privateProfile_${i.user.id}`)
                    .setLabel("Private")
                    .setEmoji("👁️"),
                    new ButtonBuilder(i.message.components[0]?.components[1].data)
                )

                if(i.message.components[0]?.components[2]) {
                    row.addComponents(new ButtonBuilder(i.message.components[0]?.components[2].data))
                }

                if(!await Profile.fetch(`${i.user.id}.private`) || await Profile.fetch(`${i.user.id}.private`) == "false") {

                    await Profile.set(`${i.user.id}.private`, "true")

                    row.components[0].setLabel("Un Private")

                    i.message.edit({
                        components: [row]
                    })

                    i.followUp({
                        embeds: [
                            await successEmbed({
                                description: `Now no one will be able to look at your profile except you.`
                            })
                        ],
                        ephemeral: true
                    })

                } else {

                    await Profile.set(`${i.user.id}.private`, "false")

                    row.components[0].setLabel("Private")

                    i.message.edit({
                        components: [row]
                    })

                    i.followUp({
                        embeds: [
                            await successEmbed({
                                description: `Now everyone can see your profile.`
                            })
                        ],
                        ephemeral: true
                    })

                }

            }

            if (i.user.id !== config.bot.owner) return;

            if (i.customId.startsWith('blacklist-add_')) { 

                const id = i.customId.replace('blacklist-add_', '');
        
                const rows = [
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId("time")
                            .setLabel("Time")
                            .setPlaceholder("How long do you want to blacklist?")
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph),
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId("reason")
                            .setLabel("Reason")
                            .setPlaceholder("Why are you blacklisting")
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                    )
                ]
        
                const modal = new ModalBuilder()
                    .setCustomId(`modal-${i.id}`)
                    .addComponents(rows)
                    .setTitle("Blacklist") 
        
                const modalSubmitInteraction = await addModal(i, modal)
                if(!modalSubmitInteraction) return;
        
                const time = modalSubmitInteraction.fields.getTextInputValue("time")
                const reason = modalSubmitInteraction.fields.getTextInputValue("reason")

                const ends = Date.now() + ms(time)

                await BlackList.set(`blacklistedUsers.${id}`, {
                    "reason": reason, "endDate": ends, "blacklistedTime": Date.now(), "whoBlacklisted": i.user.id
                })
        
                await i.message.edit({
                    components: []
                })
        
                await modalSubmitInteraction.reply({
                    content: "i blacklisted him **lol**"
                })
        
            }

            if (i.customId.startsWith('blacklist-edit_')) { 

                const id = i.customId.replace('blacklist-edit_', '');
        
                const rows = [
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId("reason")
                            .setLabel("Reason")
                            .setPlaceholder("What are you going to do about it?")
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                    )
                ]
        
                const modal = new ModalBuilder()
                    .setCustomId(`modal-${i.id}`)
                    .addComponents(rows)
                    .setTitle("Blacklist") 
        
                const modalSubmitInteraction = await addModal(i, modal)
                if(!modalSubmitInteraction) return;
        
                const reason = modalSubmitInteraction.fields.getTextInputValue("reason")

                await BlackList.set(`blacklistedUsers.${id}.reason`, reason)
        
                await i.message.edit({
                    components: []
                })
        
                await modalSubmitInteraction.reply({
                    content: "i updated the reason"
                })
        
            }

            if (i.customId.startsWith('blacklist-remove_')) { 

                const id = i.customId.replace('blacklist-remove_', '');

                await BlackList.delete(`blacklistedUsers.${id}`)
        
                await i.message.edit({
                    components: []
                })
        
                await i.reply({
                    content: "i taken it off the blacklist"
                })
        
            }

        } 

    }
}