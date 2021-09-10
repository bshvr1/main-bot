const {red, green} = require("../../configs/emojis.json")
const roller = require("../../schemas/rolveridb");
const emojis = require("../../configs/emojis.json");
const moment = require("moment");
moment.locale("tr");

module.exports = {
  conf: {
aliases: ["rollog","rolbilgi"],
name: "rollog",
help: "rollog"
  },

  run: async (client, message, args, embed) => {
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) 
{
message.react(red)
message.channel.send("Bir kullanıcı belirtmelisin!").then(x=>x.delete({timeout:5000})) 
return }
roller.findOne({ user: member.id }, async (err, res) => {
if (!res) 
{
message.lineReply("<@" + member.id + "> kişisinin rol bilgisi veritabanında bulunmadı.")
message.react(red)
return }
let rol = res.roller.sort((a, b) => b.tarih - a.tarih)
rol.length > 10 ? rol.length = 10 : rol.length = rol.length
let filterRole = rol.map(x => ` \`[${x.tarih}, ${x.state}]\` <@${x.mod}> : <@&${x.rol}>[<@${x.user}>]`)
message.channel.send(embed.setDescription(`${filterRole.join("\n")}`))
})
  },
};
