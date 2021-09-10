const coin = require("../../schemas/coin");
const conf = require("../../configs/sunucuayar.json")
const ayar = require("../../configs/sunucuayar.json")
const toplams = require("../../schemas/toplams");
const Ayarlar = require("../../configs/sunucuayar.json");
const kayitg = require("../../schemas/kayitgorev");
const settings = require("../../configs/settings.json")
const { red , green } = require("../../configs/emojis.json")
const isimler = require("../../schemas/names");
const regstats = require("../../schemas/registerStats");
const moment = require("moment")
moment.locale("tr")


module.exports = {
  conf: {
    aliases: ["erkek", "e", "man"],
    name: "erkek",
    help: "erkek [üye] [isim] [yaş]"
  },
run: async (client, message, args, embed, prefix) => { 
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!Ayarlar.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !Ayarlar.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) 
    {
    message.react(red)
    message.channel.send(`Malesef yetkin bulunmamakta dostum.`).then(x=> x.delete({timeout: 5000})) 
    return }
    if(!uye) 
    {
    message.react(red)
    message.channel.send(`Hata yaptın!\`${prefix}erkek <@Aias/ID> <Isim> <Yaş>\``).then(x=>x.delete({timeout:5000})) 
    return }
    if(message.author.id === uye.id) 
    {
    message.react(red)
    message.channel.send(`Kendini kayıt edemezsin dostum.`).then(x => x.delete({timeout: 5000})); 
    return }
    if(!uye.manageable) 
    {
    message.react(red)
    message.channel.send(`Böyle birisini kayıt edemiyorum.`).then(x => x.delete({timeout: 5000})); 
    return }
    if(message.member.roles.highest.position <= uye.roles.highest.position) 
    {
    message.react(red)
    message.channel.send(`Senden yüksekte olan birisini kayıt edemezsin.`).then(x => x.delete({timeout: 5000})); 
    return }
    const data = await isimler.findOne({ guildID: message.guild.id, userID: uye.user.id });
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || "";
    if(!isim && !yaş) 
    {
    message.react(red)
    message.channel.send(`Hata yaptın! \`${prefix}erkek <@Aias/ID> <Isim> <Yaş>\``).then(x=>x.delete({timeout:5000})) 
    return }
    if(Ayarlar.erkekRolleri.some(oku => uye.roles.cache.has(oku)) && Ayarlar.kizRolleri.some(oku => uye.roles.cache.has(oku))) { 
      message.react(red)
      message.channel.send(`Üye zaten kayıtlı dostum!`).then(x=>x.delete({timeout: 5000}));
      return }
    if(!yaş) 
    { setName = `${uye.user.username.includes(ayar.tag) ? ayar.tag : (ayar.ikinciTag ? ayar.ikinciTag : (ayar.tag || ""))} ${isim}`;
    } else { setName = `${uye.user.username.includes(ayar.tag) ? ayar.tag : (ayar.ikinciTag ? ayar.ikinciTag : (ayar.tag || ""))} ${isim} | ${yaş}`;
  } uye.setNickname(`${setName}`).catch(err => message.channel.send(`İsim çok uzun.`))
    const datas = await regstats.findOne({ guildID: message.guild.id, userID: message.member.id });
    message.react(green)
    message.channel.send(embed.setDescription(`
${uye.toString()} üyesi, <@${message.author.id}> tarafından, ${conf.erkekRolleri.length > 1 ? conf.erkekRolleri.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + conf.erkekRolleri.map(x => `<@&${x}>`).slice(-1) : conf.erkekRolleri.map(x => `<@&${x}>`).join("")} rolleri verilerek kayıt edildi! 

**Bu kişi daha önce şu isimlerle kayıt olmuş;**
${data ? data.names.splice(0, 10).map((x, i) => `\`${i + 1}.\` \`${x.name}\` (${x.rol}) , (<@${x.yetkili}>) , **[**\`${moment(x.date).format("LLL")}\`**]**`).join("\n") : ""}
    `)
.setFooter(`Toplam kayıt: ${datas ? datas.top : 0} | Erkek kayıt : ${datas ? datas.erkek : 0} | Kız kayıt : ${datas ? datas.kız : 0}`)
.setAuthor(uye.displayName, uye.user.displayAvatarURL({ dynamic: true }))
.setThumbnail(uye.user.displayAvatarURL({ dynamic: true, size: 2048 })))
    await uye.roles.add(ayar.erkekRolleri)
    await uye.roles.remove(ayar.unregRoles)
    await coin.findOneAndUpdate({ guildID: uye.guild.id, userID: message.author.id }, { $inc: { coin: settings.toplamsCoin } }, { upsert: true });
    await toplams.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { toplams: uye.user.id } }, { upsert: true });
    await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { top: 1, topGuild24: 1, topGuild7: 1, top24: 1, top7: 1, top14: 1, erkek: 1, erkek24: 1, erkek7: 1, erkek14: 1, }, }, { upsert: true });
    await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id, rol: conf.erkekRolleri.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true });
    const kayitgData = await kayitg.findOne({ guildID: message.guild.id, userID: message.author.id });
    if (kayitgData)
    {
    await kayitg.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { kayit: 1 } }, { upsert: true });
    }

if(ayar.chatChannel && client.channels.cache.has(ayar.chatChannel)) client.channels.cache.get(ayar.chatChannel).send(`Aramıza hoşgeldin **${uye}**! Kuralları okumayı unutma!`).then(x => x.delete({timeout: 10000})) 

}   }