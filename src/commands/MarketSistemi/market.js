const dolar = require("../../schemas/dolar")
module.exports = {
    conf: {
      aliases: ["market","coinmarket"],
      name: "market",
      help: "market"
    },
  
run: async (client, message, args, embed, prefix) => {
let dolarData = await dolar.findOne({ guildID: message.guild.id, userID: message.author.id });  
message.lineReply(`
\`\`\`
${message.guild.name} Mağazasına Hoşgeldiniz!
Dolarınızın yettiği eşyaları .al <ID> komutu ile alabilirsiniz.

💰 Dolarınız : ${dolarData ? Math.floor(parseInt(dolarData.dolar)) : 0}
📒 ID:  | 🧿 Ürün :         |  💳 Fiyat : 
   1      Spotify Premium       25.000 💰
   2      Netflix UHD           35.000 💰
   3      Youtube Premium       40.000 💰
   4      Classic Nitro         80.000 💰
   5      Boost Nitro           90.000 💰
\`\`\`
`)    
}
  }