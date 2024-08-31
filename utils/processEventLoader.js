const { readdirSync } = require("fs")

module.exports = (client, clearCache) => {

  const loadEvents = () => {

    var events = readdirSync("./helpers/processEvents")
    var files;

    for(var event in events) {
  
      if (!events[event].endsWith(".js")) {
  
        files = readdirSync(`./helpers/processEvents/${events[event]}`)
  
        for(var file in files) {

          if(clearCache == "true") {
            delete require.cache[require.resolve(`../helpers/processEvents/${events[event]}/${files[file]}`)]
          }

          const props = require(`../helpers/processEvents/${events[event]}/${files[file]}`)
          process.on(props.name, (...data) => props.run(client, ...data))

        }
        
      } else {

        if(clearCache == "true") {
          delete require.cache[require.resolve(`../helpers/processEvents/${events[event]}`)]
        }
        
        const props = require(`../helpers/processEvents/${events[event]}`)
        process.on(props.name, (...data) => props.run(client, ...data))
  
      }
      
    }
  
    console.log(`PROCESS_EVENTS | All successfully loaded.`)

  }

  loadEvents()
  
}