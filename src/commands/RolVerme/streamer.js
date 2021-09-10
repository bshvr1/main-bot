const musician = require("../../configs/sunucuayar.json")
const moment = require("moment")
moment.locale("tr");
const { red , green} = require("../../configs/emojis.json")
module.exports = {
  conf: {
    aliases: ["streamer","str"],
    name: "streamer",
    help: "streamer",
  },

  run: async (client, message, args, embed, prefix) => {
if (!message.member.hasPermission("BAN_MEMBERS") &&  !conf.rolverici.some(x => message.member.roles.cache.has(x))) { message.channel.send("Yeterli yetkin bulunmuyor!").then(x=>x.delete({timeout:5000}))
message.react(red)
return }
const user = message.mentions.users.first() || await client.fetchUser(args[0]);
if (!user) { message.channel.send( "Böyle bir kullanıcı bulunamadı!").then(x=>x.delete({timeout:5000}))
message.react(red)
return }
if(!user.roles.cache.has(conf.streamer)){
message.react(green)
message.lineReply(`${user} kişisine başarıyla <@&${conf.streamer}> rolü verildi!`).then(x=>x.delete({timeout:5000}))
await user.roles.add(conf.streamer)
} else {
message.react(green)
message.lineReply(`${user} kişisinden başarıyla <@&${conf.streamer}> rolü alındı!`).then(x=>x.delete({timeout:5000}))
await user.roles.remove(conf.streamer)
}}
};
