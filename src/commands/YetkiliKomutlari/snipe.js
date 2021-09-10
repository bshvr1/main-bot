const conf = require("../../configs/sunucuayar.json")
const snipe = require("../../schemas/snipe");
const moment = require("moment");
require("moment-duration-format");
const {red,green} = require("../../configs/emojis.json")
module.exports = {
  conf: {
    aliases: ["snipe"],
    name: "snipe",
    help: "snipe"
  },

  run: async (client, message, args, embed) => {
    if(!message.member.roles.cache.has(conf.cmuteHammer) && !message.member.roles.cache.has(conf.sahipRolu) && !message.member.hasPermission(8)) return message.react(red)
    const data = await snipe.findOne({ guildID: message.guild.id, channelID: message.channel.id });
    if (!data) 
    {
    message.react(red)
    message.channel.send( "Bu kanalda silinmiş bir mesaj bulunmuyor!").then(x=>x.delete({timeout:5000})) 
    return }
    const author = await client.fetchUser(data.author);
    embed.setDescription(`${data.messageContent ? `\n\`Mesaj içeriği:\` ${data.messageContent}` : ""}
\`Mesajın yazılma tarihi:\` ${moment.duration(Date.now() - data.createdDate).format("D [gün], H [saat], m [dakika], s [saniye]")} önce
\`Mesajın silinme tarihi:\` ${moment.duration(Date.now() - data.deletedDate).format("D [gün], H [saat], m [dakika], s [saniye]")} önce
\`Mesajı Atan Kişi:\` <@${data.userID}> 
`);
    if (author) embed.setAuthor(author.tag, author.avatarURL({ dynamic: true, size: 2048 }));
    if (data.image) embed.setImage(data.image);
    message.react(green)
    message.channel.send(embed);
  },
};
