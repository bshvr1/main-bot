const { RPS } = require('weky')
module.exports = {
    conf: {
      aliases: ["tas","tkm"],
      name: "tkm",
      help: "tkm"
    },
  
run: async (client, message, args, embed, prefix) => {
    const member = message.mentions.users.first();
    if(!member) return message.channel.send(`Oyunu oynamak için birisini etiketle!`).then(x=>x.delete({timeout:6000}))
    const game = new RPS({
        message: message,
        opponent: member, 
        challenger: message.author, 
        acceptMessage: `${message.author} ile oyuna başlamak için tıkla! ${member}`,
    })
    game.start() 
},
  };
  
  