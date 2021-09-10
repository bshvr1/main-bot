const dolar = require("../../schemas/dolar")
const conf = require("../../configs/sunucuayar.json")
const { red, green } = require("../../configs/emojis.json")
module.exports = {
    conf: {
      aliases: ["al","satinal","satınal"],
      name: "al",
      help: "al"
    },
  
run: async (client, message, args, embed, prefix) => {
let dolarData = await dolar.findOne({ guildID: message.guild.id, userID: message.author.id });  
if(!args[0]) 
{
    message.react(red)
    message.lineReply(`Lütfen ne almak istediğini belirt! \`${prefix}market\``).then(x=>x.delete({timeout:5000}))
    return
}    
if(args[0] == "1")
{
    if(dolarData || dolarData && 25000 > dolarData.dolar) 
    {
        message.react(red)
        message.lineReply(`\`Spotify Premium\` ürününü almak için **Dolar**'ın yetersiz!`).then(x=>x.delete({timeout:5000}))
        return
    }
message.react(green)
message.lineReply(`:tada: Tebrikler! Başarıyla \`Spotify Premium\` ürününü satın aldınız! Yetkililer en kısa zaman da sizinle iletişime geçecektir!`).then(x=>x.delete({timeout:10000}))
client.channels.cache.get(conf.marketLog).send(`${message.author} kişisi \`Spotify Premium\` ürününü satın aldı. İletişime geçmenizi bekliyor! :tada:`)
await dolar.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { dolar: -25000 } }, { upsert: true });
}
if(args[0] == "2")
{
    if(dolarData || dolarData && 35000 > dolarData.dolar) 
    {
        message.react(red)
        message.lineReply(`\`Netflix UHD\` ürününü almak için **Dolar**'ın yetersiz!`).then(x=>x.delete({timeout:5000}))
        return
    }
message.react(green)
message.lineReply(`:tada: Tebrikler! Başarıyla \`Netflix UHD\` ürününü satın aldınız! Yetkililer en kısa zaman da sizinle iletişime geçecektir!`).then(x=>x.delete({timeout:10000}))
client.channels.cache.get(conf.marketLog).send(`${message.author} kişisi \`Netflix UHD\` ürününü satın aldı. İletişime geçmenizi bekliyor! :tada:`)
await dolar.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { dolar: -35000 } }, { upsert: true });
}
if(args[0] == "3")
{
    if(dolarData || dolarData && 40000 > dolarData.dolar) 
    {
        message.react(red)
        message.lineReply(`\`Youtube Premium\` ürününü almak için **Dolar**'ın yetersiz!`).then(x=>x.delete({timeout:5000}))
        return
    }
message.react(green)
message.lineReply(`:tada: Tebrikler! Başarıyla \`Youtube Premium\` ürününü satın aldınız! Yetkililer en kısa zaman da sizinle iletişime geçecektir!`).then(x=>x.delete({timeout:10000}))
client.channels.cache.get(conf.marketLog).send(`${message.author} kişisi \`Youtube Premium\` ürününü satın aldı. İletişime geçmenizi bekliyor! :tada:`)
await dolar.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { dolar: -40000 } }, { upsert: true });
}
if(args[0] == "4")
{
    if(dolarData || dolarData && 80000 > dolarData.dolar) 
    {
        message.react(red)
        message.lineReply(`\`Classic Nitro\` ürününü almak için **Dolar**'ın yetersiz!`).then(x=>x.delete({timeout:5000}))
        return
    }
message.react(green)
message.lineReply(`:tada: Tebrikler! Başarıyla \`Classic Nitro\` ürününü satın aldınız! Yetkililer en kısa zaman da sizinle iletişime geçecektir!`).then(x=>x.delete({timeout:10000}))
client.channels.cache.get(conf.marketLog).send(`${message.author} kişisi \`Classic Nitro\` ürününü satın aldı. İletişime geçmenizi bekliyor! :tada:`)
await dolar.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { dolar: -80000 } }, { upsert: true });
}
if(args[0] == "5")
{
    if(dolarData || dolarData && 90000 > dolarData.dolar) 
    {
        message.react(red)
        message.lineReply(`\`Boost Nitro\` ürününü almak için **Dolar**'ın yetersiz!`).then(x=>x.delete({timeout:5000}))
        return
    }
message.react(green)
message.lineReply(`:tada: Tebrikler! Başarıyla \`Boost Nitro\` ürününü satın aldınız! Yetkililer en kısa zaman da sizinle iletişime geçecektir!`).then(x=>x.delete({timeout:10000}))
client.channels.cache.get(conf.marketLog).send(`${message.author} kişisi \`Boost Nitro\` ürününü satın aldı. İletişime geçmenizi bekliyor! :tada:`)
await dolar.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { dolar: -90000 } }, { upsert: true });
}

}
  }