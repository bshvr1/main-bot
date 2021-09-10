const { MessageButton, MessageActionRow } = require('discord-buttons')
const { Snake } = require('weky');
module.exports = {
    conf: {
      aliases: ["snake","yılan"],
      name: "snake",
      help: "snake"
    },
  
run: async (client, message, args, embed, prefix) => {
  new Snake({
    message: message,
    embed: {
    title: 'Kızı Yakala', 
    color: "#2f3136", 
    gameOverTitle: "Yakalayamadın!", 
    },
    emojis: {
      empty: '⬛',
      snakeBody: '👱‍♂️', 
      food: '👱‍♀️', 
      up: '⬆️', 
      right: '⬅️',
      down: '⬇️',
      left: '➡️',
      },
    }).start()
},
  };
  
  