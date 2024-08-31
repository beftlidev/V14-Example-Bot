const { Client, Partials, IntentsBitField } = require("discord.js")

const client = new Client({
    intents: Object.entries(IntentsBitField.Flags).filter(([K]) => ![].includes(K)).reduce((t, [, V]) => t | V, 0),
    partials: [
        Partials.Channel, Partials.Message, Partials.Reaction, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.ThreadMember, Partials.User
    ]
})

require("./helpers/start.js")(client);

client.login(client.token)