const coin = require("../../schemas/coin");
const moment = require("moment");
const ceza = require("../../schemas/ceza");
const cezapuan = require("../../schemas/cezapuan")
const jailLimit = new Map();
const ms = require("ms")
moment.locale("tr");
const conf = require("../../configs/sunucuayar.json")
const settings = require("../../configs/settings.json")
const { green, red } = require(`../../configs/emojis.json`)
module.exports = {
  conf: {
    aliases: ["jail","reklam"],
    name: "jail",
    help: "jail"
  },

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8) && !conf.jailHammer.some(x => message.member.roles.cache.has(x))) 
    {
    message.react(red)
    message.channel.send("Yeterli yetkin bulunmuyor!").then(x=>x.delete({timeout:5000})) 
    return }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) { message.channel.send( "Bir üye belirtmelisin!").then(x=>x.delete({timeout:5000}))
    message.react(red) 
    return }
    if (conf.jailRole.some(x => member.roles.cache.has(x))) { message.channel.send( "Bu üye zaten jailde!").then(x=>x.delete({timeout:5000}))
    message.react(red) 
    return }
    const reason = args.slice(2).join(" ") || "Belirtilmedi!";
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription("Kendinle aynı yetkide ya da daha yetkili olan birini jailleyemezsin!"));
    if (!member.manageable) return message.channel.send( "Bu üyeyi jailleyemiyorum!");
    if (settings.jaillimit > 0 && jailLimit.has(message.author.id) && jailLimit.get(message.author.id) == settings.jaillimit) 
    {
    message.react(red)
    message.channel.send( "Saatlik jail sınırına ulaştın!").then(x=>x.delete({timeout:5000})) 
    return }
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 20 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    if(conf.cezapuanlog) message.guild.channels.cache.get(conf.cezapuanlog).send(`${member} üyesi \`jail cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`);
    member.setRoles(conf.jailRole);
    message.react(green)
    const penal = await client.penalize(message.guild.id, member.user.id, "JAIL", true, message.author.id, reason);
    message.lineReply(`${green} ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle jaillendi! \`(Ceza ID: #${penal.id})\``).then(x=>x.delete({timeout:50000}))
    if (settings.dmMessages) member.send(`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle jaillendiniz.`).catch(() => {});
    

    const log = embed
      .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("#2f3136")
      .setDescription(`
${member.toString()} üyesi jaillendi!
Ceza ID: \`#${penal.id}\`
Jaillenen Üye: ${member.toString()} \`(${member.user.username.replace(/\`/g, "")} - ${member.user.id})\`
Jailleyen Yetkili: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`
Jail Tarihi: \`${moment(Date.now()).format("LLL")}\`
Jail Sebebi: \`${reason}\`
      `)
    message.guild.channels.cache.get(conf.jailLogChannel).wsend(log);

    if (settings.jaillimit > 0) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};

