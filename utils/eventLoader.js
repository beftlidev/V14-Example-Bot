const { readdirSync } = require("fs")

module.exports = (client, clearCache) => {

  const loadEvents = () => {

    var events = readdirSync("./events")
    var files;
    
    for(var event in events) {
  
      if (!events[event].endsWith(".js")) {
  
        files = readdirSync(`./events/${events[event]}`)
  
        for(var file in files) {

          if(clearCache == "true") {
            delete require.cache[require.resolve(`../events/${events[event]}/${files[file]}`)]
          }

          const props = require(`../events/${events[event]}/${files[file]}`)
          client.on(props.name, (...data) => props.run(client, ...data))
          
        }
        
      } else {

        if(clearCache == "true") {
          delete require.cache[require.resolve(`../events/${events[event]}`)]
        }
        
        const props = require(`../events/${events[event]}`)
        client.on(props.name, (...data) => props.run(client, ...data))
  
      }
      
    }
  
    console.log(`EVENTS | All successfully loaded.`)

  }

  loadEvents()
  
}