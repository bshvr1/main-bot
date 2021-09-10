const conf = require("../../configs/sunucuayar.json")
const { red, green} = require("../../configs/emojis.json")
module.exports = {
    conf: {
      aliases: ["avatar","av"],
      name: "avatar",
      help: "avatar"
    },
  
run: async (client, message, args, embed, prefix) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    message.react(green)
    message.lineReply(embed.setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
    .setImage(member.user.avatarURL({ dynamic: true, size: 2048 }))
    )
},
  };
  
  