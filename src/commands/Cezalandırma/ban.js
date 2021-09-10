const coin = require("../../schemas/coin");
const moment = require("moment");
const ceza = require("../../schemas/ceza");
const cezapuan = require("../../schemas/cezapuan")
const banLimit = new Map();
moment.locale("tr");
const conf = require("../../configs/sunucuayar.json")
const settings = require("../../configs/settings.json")
const { red, green } = require("../../configs/emojis.json")
module.exports = {
  conf: {
    aliases: ["ban","yargı"],
    name: "ban",
    help: "ban"
  },

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission("BAN_MEMBERS") &&  !conf.banHammer.some(x => message.member.roles.cache.has(x))) { message.channel.send("Yeterli yetkin bulunmuyor!").then(x=>x.delete({timeout:5000}))
    message.react(red)
    return }
    if (!args[0]) { message.channel.send( "Bir üye belirtmelisin!").then(x=>x.delete({timeout:5000}))
    message.react(red)
    return }
    const user = message.mentions.users.first() || await client.fetchUser(args[0]);
    if (!user) { message.channel.send( "Böyle bir kullanıcı bulunamadı!").then(x=>x.delete({timeout:5000}))
    message.react(red)
    return }
    const ban = await client.fetchBan(message.guild, args[0]);
    if (ban) { message.channel.send( "Bu üye zaten banlı!").then(x=>x.delete({timeout:5000}))
    message.react(red)
    return }
    const reason = args.slice(1).join(" ") || "Belirtilmedi!";
    const member = message.guild.members.cache.get(user.id);
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send("Kendinle aynı yetkide ya da daha yetkili olan birini banlayamazsın!").then(x=>x.delete({timeout:5000}))
    if (member && !member.bannable) return message.channel.send( "Bu üyeyi banlayamıyorum!").then(x=>x.delete({timeout:5000}))
    if (settings.banlimit > 0 && banLimit.has(message.author.id) && banLimit.get(message.author.id) == settings.banlimit) return message.channel.send("Saatlik ban sınırına ulaştın!").then(x=>x.delete({timeout:5000}))
    await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -100 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 100 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    if(conf.cezapuanlog) message.guild.channels.cache.get(conf.cezapuanlog).send(`${member} üyesi ban cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`);
    message.react(green)
    message.guild.members.ban(user.id, { reason }).catch(() => {});
    const penal = await client.penalize(message.guild.id, user.id, "BAN", true, message.author.id, reason);
    const gifs = ["https://media1.tenor.com/images/ed33599ac8db8867ee23bae29b20b0ec/tenor.gif?itemid=14760307", "https://media.giphy.com/media/fe4dDMD2cAU5RfEaCU/giphy.gif", "https://media1.tenor.com/images/4732faf454006e370fa9ec6e53dbf040/tenor.gif?itemid=14678194"];
    message.lineReply(`${green} ${member ? member.toString() : user.username} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle banlandı! \`(Ceza ID: #${penal.id})\``).then(x=>x.delete({timeout:50000}))
    message.react(green)
    if (settings.dmMessages) user.send(`**${message.guild.name}** sunucusundan, **${message.author.tag}** tarafından, **${reason}** sebebiyle banlandınız!`).catch(() => {});

    const log = embed
      .setAuthor(user.username, user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("#2f3136")
      .setDescription(`
${member ? member.toString() : user.username} üyesi banlandı!

Ceza ID: \`#${penal.id}\`
Banlanan Üye: ${member ? member.toString() : ""} \`(${user.username.replace(/\`/g, "")} - ${user.id})\`
Banlayan Yetkili: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`
Ban Tarihi: \`${moment(Date.now()).format("LLL")}\`
Ban Sebebi: \`${reason}\`
      `)
      .setImage(gifs.random())
    message.guild.channels.cache.get(conf.banLogChannel).send(log);

    if (settings.banlimit > 0) {
      if (!banLimit.has(message.author.id)) banLimit.set(message.author.id, 1);
      else banLimit.set(message.author.id, banLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (banLimit.has(message.author.id)) banLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};

