const gorev = require("../../schemas/invite");
const kayitg = require("../../schemas/kayitgorev");
const mesaj = require("../../schemas/mesajgorev");
const tagli = require("../../schemas/taggorev");
const coin = require("../../schemas/coin");
const conf = require("../../configs/sunucuayar.json")
const moment = require("moment");
require("moment-duration-format");
const { xp, gulucuk, mesaj2, altin, altin2 ,rewards , fill, empty, fillStart, emptyEnd, fillEnd } = require("../../configs/emojis.json")

module.exports = {
    conf: {
      aliases: ["görev", "gorev"],
      name: "görev",
      help: "görev"
    },
  
    run: async (client, message, args, embed, prefix) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const gorevData = await gorev.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total = gorevData ? gorevData.invite : 0;
    const maxValue = "10"
    const coinStatus = client.ranks.length > 0 ?
`**Invite Görev Durumu :** 
${gulucuk} ${progressBar(gorevData ? gorevData.invite : 0, 10, 10)} \`${total} (${total}/10)\` 
` : "";
          //
    const kayitgData = await kayitg.findOne({ guildID: message.guild.id, userID: member.user.id });
    const kayittotal = kayitgData ? kayitgData.kayit : 0;
    const maxValue2 = "10"
    const coinStatus2 = client.ranks.length > 0 ?
`**Kayıt Görev Durumu :**  
${xp} ${progressBar(kayitgData ? kayitgData.kayit : 0, 10, 10)} \`${kayittotal} (${kayittotal}/10)\`
` : "";
          //
    const mesajData = await mesaj.findOne({ guildID: message.guild.id, userID: member.user.id });
    const mesajtotal = mesajData ? mesajData.mesaj : 0;
    const maxValue3 = "10"
    const coinStatus3 = client.ranks.length > 0 ?
`**Mesaj Görev Durumu :**  
${mesaj2} ${progressBar(mesajData ? mesajData.mesaj : 0, 500, 5)} \`${mesajtotal} (${mesajtotal}/500)\`
` : "";
          //
    const tagData = await tagli.findOne({ guildID: message.guild.id, userID: member.user.id });
    const tagTotal = tagData ? tagData.tagli : 0;
    const maxValue4 = "5"
    const coinStatus4 = client.ranks.length > 0 ?
`**Taglı Üye Durumu :**  
${altin} ${progressBar(tagData ? tagData.tagli : 0, 5, 5)} \`${tagTotal} (${tagTotal}/5)\`
` : "";


message.channel.send(embed.setDescription(`
Kalan Süre: ${moment.duration(moment().endOf('day').valueOf() - Date.now()).format("H [saat], m [dakika] s [saniye]")}
Selam Dostum! \`${message.guild}\` sunucusunda ki görevlerin aşağıda listelenmiştir.
5 görevi tamamlamak sana toplam \`120 Coin\` verecektir!
Ödüllerinizi toplamak için \`${prefix}görev ödül\` komutunu kullanabilirsiniz!
          
${coinStatus} **Ödülün :** ${rewards} \`30 Coin\`\n
${coinStatus2} **Ödülün :** ${rewards} \`30 Coin\`\n
${coinStatus3} **Ödülün :** ${rewards} \`30 Coin\`\n
${coinStatus4} **Ödülün :** ${rewards} \`30 Coin\`\n
`)
.setThumbnail(`https://cdn.discordapp.com/attachments/831976699960885319/838471669126922270/s-05c34508076e3043460494f967bbfc54a752431c.gif`))
}
};
function progressBar(value, maxValue, size) {
    const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
    const emptyProgress = size - progress > 0 ? size - progress : 0;
    if (progress === maxValue) return "Tamamlandı!";

    const progressText = fill.repeat(progress);
    const emptyProgressText = empty.repeat(emptyProgress);
    
    return emptyProgress > 0 ? fillStart+progressText+emptyProgressText+emptyEnd : fillStart+progressText+emptyProgressText+fillEnd;
    
};