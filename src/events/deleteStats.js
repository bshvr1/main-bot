const { CronJob } = require("cron");
const client = global.client;
const messageGuild = require("../schemas/messageGuild");
const voiceGuild = require("../schemas/voiceGuild");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");

const gorev = require("../schemas/invite");
const kayitg = require("../schemas/kayitgorev");
const mesaj = require("../schemas/mesajgorev");
const tagli = require("../schemas/taggorev");
const conf = require("../configs/settings.json")

module.exports = () => {

  const gorevs = new CronJob("0 0 * * *", () => {
    client.guilds.cache.forEach(async (guild) => {
      guild.members.cache.forEach(async (member) => {
        await gorev.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { invite: 0 } }, { upsert: true });
        await kayitg.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { kayit: 0 } }, { upsert: true });
        await mesaj.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { mesaj: 0 } }, { upsert: true });
        await tagli.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { tagli: 0 } }, { upsert: true });
        });
      console.log(`Sunucudaki ${client.guilds.cache.get(conf.guildID).memberCount} üyenin günlük görevleri başarıyla yüklendi. [00:00]`)
    });
  }, null, true, "Europe/Istanbul");
  gorevs.start();

  const daily = new CronJob("0 0 * * *", () => {
    client.guilds.cache.forEach(async (guild) => {
      await messageGuild.findOneAndUpdate({ guildID: guild.id }, { $set: { dailyStat: 0 } });
      await voiceGuild.findOneAndUpdate({ guildID: guild.id }, { $set: { dailyStat: 0 } });
      await messageUser.findOneAndUpdate({ guildID: guild.id }, { $set: { dailyStat: 0 } });
      await voiceUser.findOneAndUpdate({ guildID: guild.id }, { $set: { dailyStat: 0 } });
    });
  }, null, true, "Europe/Istanbul");
  daily.start();

  const weekly = new CronJob("0 0 * * 0", () => {
    client.guilds.cache.forEach(async (guild) => {
      await messageGuild.findOneAndUpdate({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
      await voiceGuild.findOneAndUpdate({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
      await messageUser.findOneAndUpdate({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
      await voiceUser.findOneAndUpdate({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
    });
  }, null, true, "Europe/Istanbul");
  weekly.start();

  const twoWeekly = new CronJob("0 0 1,15 * *", () => {
    client.guilds.cache.forEach(async (guild) => {
      await messageGuild.findOneAndUpdate({ guildID: guild.id }, { $set: { twoWeeklyStat: 0 } });
      await voiceGuild.findOneAndUpdate({ guildID: guild.id }, { $set: { twoWeeklyStat: 0 } });
      await messageUser.findOneAndUpdate({ guildID: guild.id }, { $set: { twoWeeklyStat: 0 } });
      await voiceUser.findOneAndUpdate({ guildID: guild.id }, { $set: { twoWeeklyStat: 0 } });
    });
  }, null, true, "Europe/Istanbul")
  twoWeekly.start();
};

module.exports.conf = {
  name: "ready"
};