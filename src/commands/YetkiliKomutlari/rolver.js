const conf = require("../../configs/sunucuayar.json")
const { red } = require("../../configs/emojis.json")
module.exports = {
  conf: {
    aliases: ["rolver","rol-ver","r"],
    name: "rolver",
    help: "rolver"
  },

  run: async (client, message, args, embed) => {
    if(!conf.rolverici.some(oku => message.member.roles.cache.has(oku)) && !conf.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.hasPermission('ADMINISTRATOR')) 
    {
    message.react(red)
    message.lineReply(`Malesef yetkin bulunmamakta dostum.`).then(x=> x.delete({timeout: 5000})) 
    return }
    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

    if (!rMember) 
    {
    message.lineReply(`Bir kullanıcı etiketlemesin dostum.`).then(x=>x.delete({timeout:6000}))
    message.react(red)
    return }
    let role = message.mentions.roles.first() || message.guild.roles.cache.find(a => a.name == args.slice(1).join(' ')) || message.guild.roles.cache.get(args[1]);
    if (!role) 
    {
    message.lineReply(`Bir rol belirtmelisin dostum.`).then(x=>x.delete({timeout:5000}))
    message.react(red)
    return }

    if (rMember.roles.cache.has(role.id)) 
    {
    await (rMember.roles.remove(role.id))
    message.lineReply(`Rol başarıyla ${rMember} üyesinden alındı!`).then(x=>x.delete({timeout:5000}))
    message.react(green)
    return }
    await (rMember.roles.add(role.id))

    message.lineReply(`Rol başarıyla ${rMember} kişisine verildi!`).then(x=>x.delete({timeout:5000}));
    message.react(green)

 
   },
 };
