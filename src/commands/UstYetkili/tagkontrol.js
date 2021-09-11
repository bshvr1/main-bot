const { green, red } = require("../../configs/emojis.json")
const conf = require("../../configs/sunucuayar.json")
module.exports = {
    conf: {
      aliases: ["kontrol","check"],
      name: "kontrol",
      help: "kontrol"
    },
  
    run: async (client, message, args, embed) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) { message.lineReply("Yeterli yetkin bulunmuyor!").then(x=>x.delete({timeout:5000}))
        message.react(red)
        return }
        let tag = conf.tag
        let tag1 = message.guild.members.cache.filter(tagdakiler => { return tagdakiler.user.username.includes(tag);});
        message.react(green)
        
        
        tag1.forEach(async member => {
        if(member.user.bot) return;
        await member.roles.add(conf.ekipRolu);
        if (member.manageable) await member.setNickname(member.displayName.replace(conf.ikinciTag, conf.tag));
        })
        
        message.lineReply(embed.setDescription(`❯ **${tag}** Tag'ına sahip herkese [<@&${conf.ekipRolu}>] rolü dağtılımaya başlandı.`))
      },
    };
    
    
  
  