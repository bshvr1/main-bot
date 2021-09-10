const { TicTacToe } = require('weky')
module.exports = {
    conf: {
      aliases: ["xox"],
      name: "xox",
      help: "xox"
    },
  
run: async (client, message, args, embed, prefix) => {
const member = message.mentions.users.first();
if (!member) return message.lineReply(`Lütfen oyun oynamak istediğin kişiyi etiketle.`).then(x=>x.delete({timeout:6000}))
    const game = new TicTacToe({
        message: message,
        opponent: member, 
        xColor: 'red', 
        oColor: 'blurple', 
        xEmoji: '❌', 
        oEmoji: '0️⃣' ,
    })
    game.start()
},
  };
  
  