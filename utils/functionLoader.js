const fs = require("fs")

module.exports = async(client, clearCache) => {

  const loadFunctions = async() => {

    let commandPath = "./functions"

    for (const file of fs.readdirSync(commandPath).filter((file) => file.endsWith(".js"))) {

      if(clearCache == "true") {
          delete require.cache[require.resolve(`../functions/${file}`)]
      }

      require(`../functions/${file}`)

    }

    console.log(`FUNCTIONS | All successfully loaded.`)
    console.log()

  }

  await loadFunctions()

}
