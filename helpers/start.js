const { Collection } = require("discord.js")
const config = require("../config.js")

module.exports = async (client) => {

    client.commands = new Collection()
    client.setMaxListeners(100)
    client.token = config.token.bot

    const utils = [
        "../utils/appsLoader.js",
        "../utils/slashLoader.js",
        "../utils/eventLoader.js",
        "../utils/processEventLoader.js",
        "../utils/functionLoader.js"
    ];

    const helpers = [
        "../helpers/topGG.js"
    ]

    utils.forEach(util => require(util)(client, "false"));
    helpers.forEach(helper => require(helper)(client))

}