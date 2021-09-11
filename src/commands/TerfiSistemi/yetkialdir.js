const coin = require("../../schemas/coin");
const yetkis = require("../../schemas/yetkis");
const conf = require("../../configs/sunucuayar.json")
const settings = require("../../configs/settings.json")
const { red, green} = require("../../configs/emojis.json")
module.exports = {
  conf: {
    aliases: ["yetkiver", "yetkili"],
    name: "yetkili",
    help: "yetkili [kullanıcı]"
  },

  run: async (client, message, args, embed) => {
    if (!conf.staffs.some(x => message.member.roles.cache.has(x))) return message.react(red)
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) 
    {
    message.react(red)
    message.channel.send("Bir üye belirtmelisin!").then(x=>x.delete({timeout:5000})) 
    return }
    if (!member.user.username.includes(conf.tag)) 
    {
    message.react(red)
    message.channel.send("Bu üye taglı değil!").then(x=>x.delete({timeout:5000})) 
    return }
    const yetkiData = await yetkis.findOne({ guildID: message.guild.id, userID: message.author.id });
    if (yetkiData && yetkiData.yetkis.includes(member.user.id)) 
    {
    message.react(red)
    message.channel.send("Bu üye zaten önceden yetkili olmuş.").then(x=>x.delete({timeout:5000})) 
    return }

    embed.setDescription(`${message.member.toString()} üyesi sana yetki vermek istiyor. Kabul ediyor musun?`);
    const msg = await message.channel.send(member.toString(), { embed });
    msg.react("✅");
    msg.react("❌");

    msg.awaitReactions((reaction, user) => ["✅", "❌"].includes(reaction.emoji.name) && user.id === member.user.id, {
      max: 1,
      time: 30000,
      errors: ['time']
    }).then(async collected => {
      const reaction = collected.first();
      if (reaction.emoji.name === '✅') {
        await coin.findOneAndUpdate({ guildID: member.guild.id, userID: message.author.id }, { $inc: { coin: settings.yetkiCoin } }, { upsert: true });
        embed.setColor("GREEN");
        msg.edit(embed.setDescription(`${member.toString()} üyesi başarıyla yetkili oldu!`)).then(x => x.delete({timeout: 5000}))
        message.channel.send(`${member.toString()} aramıza hoşgeldin!`)
        member.roles.add(conf.yetkiRolleri)
        await yetkis.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { yetkis: member.user.id } }, { upsert: true });
      } else {
        embed.setColor("RED");
        msg.edit(embed.setDescription(`${member.toString()} üyesi, yetkiye alma teklifini reddetti!`));
      }
    }).catch(() => msg.edit(embed.setDescription("Yetki verme işlemi iptal edildi!")));
  }
}