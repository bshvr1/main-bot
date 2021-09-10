const {red, green} = require("../../configs/emojis.json")
module.exports = {
    conf: {
      aliases: ["çek"],
      name: "çek",
      help: "çek"
    },
  
run: async (client, message, args, embed, prefix) => {
       if (!message.member.voice.channelID) 
    {
    message.react(red)
    message.channel.send("Bir ses kanalında olmalısın!").then(x => x.delete({timeout: 5000})); 
    return }
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!uye) 
    {
    message.react(red)
    message.lineReply("Bir kullanıcı belirtmelisin!").then(x=>x.delete({timeout: 5000})) 
    return }
    if (!uye.voice.channelID) 
    {
    message.react(red)
    message.lineReply("Bu kullanıcı herhangi bir ses kanalında bulunmuyor!").then(x=>x.delete({timeout: 5000})) 
    return }
    if (message.member.voice.channelID === uye.voice.channelID) 
    {
    message.react(red)
    message.lineReply("Zaten aynı kanaldasınız!").then(x=>x.delete({timeout: 5000})) 
    return }
      const reactionFilter = (reaction, user) => {
        return ['✅'].includes(reaction.emoji.name) && user.id === uye.id;
      };
      message.lineReply(`${uye}, ${message.author} seni ses kanalına çekmek için izin istiyor! Onaylıyor musun?`).then(async msj => {
        await msj.react('✅');
        msj.awaitReactions(reactionFilter, {max: 1, time: 15000, error: ['time']}).then(c => {
      let cevap = c.first();
      if (cevap) {
        uye.voice.setChannel(message.member.voice.channelID);
        msj.edit(`${message.author}, ${uye} kişisini kanalına çekti!`)
        msj.delete({timeout:5000});
        message.react(green).catch();
      }
      else {
        msj.edit(`${message.author}, süre bitti!`)
        msj.delete({timeout:5000});
        message.react(red).catch();
      }
        });
      });
    }
  }