const conf = require("../../configs/sunucuayar.json")
const ayar = require("../../configs/sunucuayar.json")
const { red, green } = require("../../configs/emojis.json")

module.exports = {
  conf: {
    aliases: ["kayıtsız","ks","kayitsiz"],
    name: "kayitsiz",
    help: "kayitsiz"
  },
  run: async (client, message, args, embed, prefix) => { 
    if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.hasPermission('ADMINISTRATOR')) 
    {
    message.react(red)
    message.channel.send(`Hata: Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin.`).then(sil => sil.delete({timeout: 5000})); 
    return }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) 
    {
    message.react(red)
    message.channel.send("Bir üye belirtmelisin!").then(x=>x.delete({timeout:5000})) 
    return }
    if (!message.member.hasPermission(8) && member.roles.highest.position >= message.member.roles.highest.position) 
    {
    message.react(red) 
    message.channel.send("Kendinle aynı yetkide ya da daha yetkili olan birini kayıtsıza atamazsın!").then(x=>x.delete({timeout:5000})) 
    return }
    if (!member.manageable) 
    {
    message.react(red)
    message.channel.send( "Bu üyeyi kayıtsıza atamıyorum!").then(x=>x.delete({timeout:5000})) 
    return }
    message.react(green)
    member.roles.set(conf.unregRoles);
    member.setNickname(`${ayar.ikinciTag} İsim | Yaş`)
    message.channel.send(`${green} ${member} üyesi, ${message.author} tarafından, kayıtsıza atıldı!`).then(x=>x.delete({timeout:5000}))
  
  },
};