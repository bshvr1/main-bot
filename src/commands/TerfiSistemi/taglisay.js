const taggeds = require("../../schemas/taggeds");
const conf = require("../../configs/sunucuayar.json")
const { red, green } = require("../../configs/emojis.json")
module.exports = {
  conf: {
    aliases: ["tagli-say", "taglısay","taglı-say","taglılarım","taglılar","taglisay"],
    name: "taglılarım",
    help: "taglılar"
  },

  run: async (client, message, args, embed) => {
    if (!conf.staffs.some(x => message.member.roles.cache.has(x))) return message.react(red)
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const taggedData = await taggeds.findOne({ guildID: message.guild.id, userID: message.author.id });
    if(taggedData === null) 
    {
    message.react(red)
    message.channel.send(`Henüz kimseye tag aldırmamışsın!`).then(x => x.delete({timeout: 5000})); 
    return }
  const uyeler = taggedData.taggeds.slice(0,5).map(x => `<@${x}>`).join(", ")
  if(taggedData > 0) {
  message.react(green)
  message.channel.send(embed.setDescription(`Tag aldırdığı üye sayısı: \`${taggedData.taggeds.length}\`
  ${uyeler}
  `))
    } }
  }