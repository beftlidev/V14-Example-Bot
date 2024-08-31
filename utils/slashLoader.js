const fs = require("fs")

module.exports = async(client, clearCache) => {

  const loadSlashs = () => {

    let commandPath = "./commands"

    for (const file of fs.readdirSync(commandPath).filter((file) => file.endsWith(".js"))) {

      if(clearCache == "true") {
        delete require.cache[require.resolve(`../commands/${file}`)]
      }

      const command = require(`../commands/${file}`);
      
      client.commands.set(command.data.name, command);

    }

    console.log(`SLASH_COMMANDS | All successfully loaded.`)

  }

  loadSlashs()

}
