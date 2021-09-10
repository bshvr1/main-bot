const regstats = require("../../schemas/registerStats");
const ayar = require("../../configs/sunucuayar.json")
const { red, green } = require("../../configs/emojis.json")
module.exports = {
  conf: {
    aliases: [],
    name: "teyitler",
    help: "teyitler"
  },
  run: async (client, message, args, embed, prefix) => { 
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.hasPermission('ADMINISTRATOR')) 
    {
    message.react(red)
    message.channel.send(`Hata: Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin.`).then(sil => sil.delete({timeout: 5000}));
    return }
    if (args[0] === "top") {
      let registerTop = await regstats.find({ guildID: message.guild.id }).sort({ top: -1 });

      if (!registerTop.length) 
      {
      message.react(red)
      message.channel.send("Herhangi bir kayıt verisi bulunamadı!").then(x=>x.delete({timeout:5000})) 
      return }
      registerTop = registerTop.filter((x) => message.guild.members.cache.has(x.userID)).splice(0, 10);
      message.react(green)
      message.channel.send(embed.setDescription(registerTop.map((x, i) => `\`${i + 1}.\` <@${x.userID}> Toplam **${x.top}** (\`${x.erkek} Erkek, ${x.kız} Kız\`)`)));
    } else if (!args[0]) {
      const data = await regstats.findOne({ guildID: message.guild.id, userID: member.id });
      message.react(green)
      message.channel.send(embed.setDescription(`
24 saatlik toplam kayıt bilgisi: \`${data ? data.top24 : 0}\`
24 saatlik erkek kayıt bilgisi: \`${data ? data.erkek24 : 0}\`
24 saatlik kız kayıt bilgisi: \`${data ? data.kız24 : 0}\`

1 haftalık toplam kayıt bilgisi: \`${data ? data.top7 : 0}\`
1 haftalık erkek kayıt bilgisi: \`${data ? data.erkek7 : 0}\`
1 haftalık kız kayıt bilgisi: \`${data ? data.kız7 : 0}\`
  
2 haftalık toplam kayıt bilgisi: \`${data ? data.top14 : 0}\`
2 haftalık toplam kayıt erkek bilgisi: \`${data ? data.erkek14 : 0}\`
2 haftalık toplam kayıt kız bilgisi: \`${data ? data.kız14 : 0}\`
  
Toplam kayıt bilgisi: \`${data ? data.top : 0}\`
Toplam erkek kayıt bilgisi: \`${data ? data.erkek : 0}\`
Toplam kız kayıt bilgisi: \`${data ? data.kız : 0}\`
	`));
    }
  },
};
