const client = global.client;
const conf = require("../configs/sunucuayar.json");
const settings = require("../configs/settings.json")
const penals = require("../schemas/penals");
const {MessageEmbed} = require("discord.js")
module.exports = async () => {
//ETKİNLİK ROL ALMA
  client.ws.on('INTERACTION_CREATE', async interaction => {  
    let name = interaction.data.custom_id
    let GameMap = new Map([
        ["buttoncekilis",`${conf.cekilis}`],
        ["buttonetkinlik",`${conf.etkinlik}`],
        ["buttonsevgilimvar",`${conf.sevgilimvar}`],
        ["buttonsevgilimyok",`${conf.sevgilimyok}`],
        ["buttonlgbt",`${conf.lgbt}`]

    ])
    let member = await client.guilds.cache.get(settings.guildID).members.fetch(interaction.member.user.id)
    if(!GameMap.has(name) || !member) return;
    let role = GameMap.get(name)
    let returnText;
    if(member.roles.cache.has(role)){
        await member.roles.remove(role)
        returnText = `Rol üzerinizden alındı`
    }else{
        await member.roles.add(role)
        returnText = `Rol üzerinize verildi`
      }
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: {
                content: returnText,
                flags: "64"}}})});
  client.guilds.cache.forEach(async (guild) => {
    const invites = await guild.fetchInvites();
    client.invites.set(guild.id, invites);
  });

  let botVoiceChannel = client.channels.cache.get(conf.botses); 
  if (botVoiceChannel) 
  botVoiceChannel.join().then(console.log(`Bot ses kanalına bağlandı!`)).catch(err => console.error("[HATA] Bot ses kanalına bağlanamadı!"));
  client.user.setPresence({ activity: { name: settings.botDurum}, status: "online" });
  
client.guilds.cache.get(settings.guildID).members.cache.filter(uye => uye.user.username.includes(conf.tag) && !uye.user.bot && !uye.roles.cache.has(conf.boosterRolu) && (!uye.roles.cache.has(conf.ekipRolu) || !uye.displayName.startsWith(conf.tag))).array().forEach((uye) => {
setTimeout(() => {
    uye.setNickname(uye.displayName.replace(conf.ikinciTag, conf.tag));
    if (conf.ekipRolu) uye.roles.add(conf.ekipRolu).catch({ })
}, 1000 * 60 * 60);
})

setInterval(async () => {  
  const guild = client.guilds.cache.get(settings.guildID);
  if (!guild) return;
  const finishedPenals = await penals.find({ guildID: guild.id, active: true, temp: true, finishDate: { $lte: Date.now() } });
  finishedPenals.forEach(async (x) => {
    const member = guild.members.cache.get(x.userID);
    if (!member) return;
    if (x.type === "CHAT-MUTE") {
      x.active = false;
      await x.save();
      await member.roles.remove(conf.chatMute);
      client.channels.cache.get(conf.cmuteLogChannel).send(new MessageEmbed().setColor("#2f3136").setDescription(`${member.toString()} üyesinin susturulması, süresi bittiği için kaldırıldı!`));
    }
    if (x.type === "TEMP-JAIL") {
      x.active = false;
      await x.save();
      await member.setRoles(conf.unregister);
      client.channels.cache.get(conf.jailLogChannel).send(new MessageEmbed().setColor("#2f3136").setDescription(`${member.toString()} üyesinin jaili, süresi bittiği için kaldırıldı!`));
    } 
    if (x.type === "VOICE-MUTE") {
      if (member.voice.channelID) {
        x.removed = true;
        await x.save();
        if (member.voice.serverMute) member.voice.setMute(false);
      }
      x.active = false;
      await x.save();
      member.roles.remove(conf.voiceMute);
      client.channels.cache.get(conf.vmuteLogChannel).send(new MessageEmbed().setColor("#2f3136").setDescription(`${member.toString()} üyesinin **sesli kanallarda** susuturulması, süresi bittiği için kaldırıldı!`));
    }
  });

  const activePenals = await penals.find({ guildID: guild.id, active: true });
  activePenals.forEach(async (x) => {
    const member = guild.members.cache.get(x.userID);
    if (!member) return;
    if (x.type === "CHAT-MUTE" && !conf.chatMute.some((x) => member.roles.cache.has(x))) return member.roles.add(conf.chatMute);
    if ((x.type === "JAIL" || x.type === "TEMP-JAIL") && !conf.jailRole.some((x) => member.roles.cache.has(x))) return member.setRoles(conf.jailRole);
    if (x.type === "VOICE-MUTE") {
      if (!conf.voiceMute.some((x) => member.roles.cache.has(x))) member.roles.add(conf.voiceMute);
      if (member.voice.channelID && !member.voice.serverMute) member.voice.setMute(true);
    }
  });
}, 1000 * 60);
};

module.exports.conf = {
  name: "ready",
};