const moment = require("moment");
require("moment-duration-format");
const messageGuild = require("../../schemas/messageGuild");
const voiceGuild = require("../../schemas/voiceGuild");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
module.exports = {
    conf: {
      aliases: ["topstat","ts"],
      name: "topstat",
      help: "topstat"
    },
  
run: async (client, message, args, embed, prefix) => {
    const messageUsersData = await messageUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
    const voiceUsersData = await voiceUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
    const messageGuildData = await messageGuild.findOne({ guildID: message.guild.id });
    const voiceGuildData = await voiceGuild.findOne({ guildID: message.guild.id });


    const messageUsers = messageUsersData.splice(0, 5).map((x, index) => `\`${index+1}.\` <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\``).join(`\n`);
    const voiceUsers = voiceUsersData.splice(0, 5).map((x, index) => `\`${index+1}.\` <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika] s [saniye]")}\``).join(`\n`);
    embed.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 2048 }))
     message.channel.send(embed.setDescription(`
    ${message.guild.name} sunucusunun toplam ses ve chat bilgileri gösterilmektedir.
    `)
    .addField(`**Genel ses sıralaması**(\`Toplam ${moment.duration(voiceGuildData ? voiceGuildData.topStat : 0).format("H [saat], m [dakika]")}\`)`,`${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."}`,true)
    .addField(`**Genel chat sıralaması**(\`Toplam ${Number(messageGuildData ? messageGuildData.topStat : 0).toLocaleString()} mesaj\`)`,`${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."}`,true)
     )
},
  };
  
  