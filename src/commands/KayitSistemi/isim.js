const ayar = require("../../configs/sunucuayar.json")
const Ayarlar = require("../../configs/sunucuayar.json");
const { red , green } = require("../../configs/emojis.json")
const isimler = require("../../schemas/names");
const moment = require("moment")
moment.locale("tr")


module.exports = {
  conf: {
    aliases: ["isim", "i", "nick"],
    name: "isim",
    help: "isim [üye] [isim] [yaş]"
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
    message.channel.send(`Hata yaptın!\`${prefix}isim <@Aias/ID> <Isim> <Yaş>\``).then(x=>x.delete({timeout:5000})) 
    return }
    if(message.author.id === uye.id) 
    {
    message.react(red)
    message.channel.send(`Kendi ismini değiştiremezsin dostum. Booster isen \`${prefix}zengin\``).then(x => x.delete({timeout: 5000})); 
    return }
    if(!uye.manageable) 
    {
    message.react(red)
    message.channel.send(`Böyle birisinin ismini değiştiremiyorum.`).then(x => x.delete({timeout: 5000})); 
    return }
    if(message.member.roles.highest.position <= uye.roles.highest.position) 
    {
    message.react(red)
    message.channel.send(`Senden yüksekte olan birisinin ismini değiştiremezsin.`).then(x => x.delete({timeout: 5000})); 
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
    if(!yaş) 
    { setName = `${uye.user.username.includes(ayar.tag) ? ayar.tag : (ayar.ikinciTag ? ayar.ikinciTag : (ayar.tag || ""))} ${isim}`;
    } else { setName = `${uye.user.username.includes(ayar.tag) ? ayar.tag : (ayar.ikinciTag ? ayar.ikinciTag : (ayar.tag || ""))} ${isim} | ${yaş}`;
  } uye.setNickname(`${setName}`).catch(err => message.channel.send(`İsim çok uzun.`))
    message.react(green)
    message.channel.send(embed.setDescription(`
${uye.toString()} üyesinin ismi başarıyla ${setName} olarak değiştirildi!  

**Bu kişi daha önce şu isimlerle kayıt olmuş;**
${data ? data.names.splice(0, 10).map((x, i) => `\`${i + 1}.\` \`${x.name}\` (${x.rol}) , (<@${x.yetkili}>) , **[**\`${moment(x.date).format("LLL")}\`**]**`).join("\n") : ""}
    `)
.setAuthor(uye.displayName, uye.user.displayAvatarURL({ dynamic: true }))
.setThumbnail(uye.user.displayAvatarURL({ dynamic: true, size: 2048 })))
    await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id,  rol: "İsim Komutu", date: Date.now() } } }, { upsert: true });

}   }