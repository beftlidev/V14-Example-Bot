const fs = require("fs")

module.exports = async(client, clearCache) => {

  const loadApps = () => {

    let commandPath = "./appsCommands"

    for (const file of fs.readdirSync(commandPath).filter((file) => file.endsWith(".js"))) {

      if(clearCache == "true") {
        delete require.cache[require.resolve(`../appsCommands/${file}`)]
      }

      const command = require(`../appsCommands/${file}`);
      client.commands.set(command.data.name, command);

    }

    console.log(`APPS_COMMANDS | All successfully loaded.`)

  }

  loadApps()

}
