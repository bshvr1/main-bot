const { MessageButton, MessageActionRow } = require('discord-buttons')
const { fight } = require('weky');
module.exports = {
    conf: {
      aliases: ["duello","düello"],
      name: "düello",
      help: "düello"
    },
  
run: async (client, message, args, embed, prefix) => {
    const opponent = message.mentions.users.first();

    if (!opponent) return message.lineReply(`Oynamak için birini etiketle.`).then(x=>x.delete({timeout:5000}))
    
    
    const battle = new fight({
    
        client: client,
    
        message: message,
    
        acceptMessage: `${opponent} savaş için tike tıkla!`, //message sent to see if opponent accepts
    
        challenger: message.author, // NOT CHANGEABLE
    
        opponent: opponent,  // NOT CHANGEABLE
    
        hitButtonText: 'Saldır!', // Hit button text (Custom)
    
        hitButtonColor: 'red', // Hit button color (Custom)
    
        healButtonText: 'Can Bas!', // Heal button text (Custom)
    
        healButtonColor:  'green', // Heal button color (Custom)
    
        cancelButtonText: 'Kaç!', // Cancel button text (Custom)
    
        cancelButtonColor: 'blurple', // Cancel button color (Custom)
    
    });
    
    battle.start();
},
  };
  
  