const client = global.client;
const { Collection } = require("discord.js");
const inviterSchema = require("../schemas/inviter");
const inviteMemberSchema = require("../schemas/inviteMember");
const coin = require("../schemas/coin");
const gorev = require("../schemas/invite");
const ayar = require("../configs/sunucuayar.json")
const moment = require("moment");
const { star, green, red } = require("../configs/emojis.json")


module.exports = async (member) => {
  let guvenilirlik = Date.now()-member.user.createdTimestamp < 1000*60*60*24*7;
  if (guvenilirlik) {
  if(ayar.fakeAccRole) member.roles.set([ayar.fakeAccRole]).catch();
  } else if(ayar.unregRoles) member.roles.add(ayar.unregRoles).catch();
  if (member.user.username.includes(ayar.tag)) { member.setNickname(`${ayar.tag} İsim | Yaş`).catch(); }
  else { member.setNickname(`${ayar.ikinciTag} İsim | Yaş`).catch();}
  

  let memberGün = moment(member.user.createdAt).format("DD");
  let memberTarih = moment(member.user.createdAt).format("YYYY HH:mm:ss");
  let memberAylar = moment(member.user.createdAt).format("MM").replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık");
  let üyesayısı = member.guild.members.cache.size.toString().replace(/ /g, "    ")
    

  const channel = member.guild.channels.cache.get(ayar.invLogChannel);
  const kayitchannel = member.guild.channels.cache.get(ayar.teyitKanali);
  const kurallar = member.guild.channels.cache.get(ayar.kurallar);
  if (!channel) return;
  if (member.user.bot) return;

  const gi = client.invites.get(member.guild.id).clone() || new Collection().clone();
  const invites = await member.guild.fetchInvites();
  const invite = invites.find((x) => gi.has(x.code) && gi.get(x.code).uses < x.uses) || gi.find((x) => !invites.has(x.code)) || member.guild.vanityURLCode;
  client.invites.set(member.guild.id, invites);

if (invite === member.guild.vanityURLCode) 
kayitchannel.wsend(`
${star} ${member} **Aramıza Hoşgeldin!**\n   
Seninle beraber **${üyesayısı}** kişiyiz.\n
Hesabın açılış süresi ${memberGün} ${memberAylar} ${memberTarih}  ${guvenilirlik ? `Şüpheli! ${red}` : `Güvenli! ${green}` }\n
${kurallar} kanalından kurallarımızı okumalısın. Sunucuya kayıt olduktan sonra kuralları okumuş kabul edeceğiz ve içeride yapılan cezaişlemlerde bunu göz önünde bulunduracağız.\n
**Seni Davet eden:** Sunucu Özel URL :tada: :tada: :tada:`);
if (!invite.inviter) return;
await inviteMemberSchema.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $set: { inviter: invite.inviter.id, date: Date.now() } }, { upsert: true });
if (Date.now() - member.user.createdTimestamp <= 1000 * 60 * 60 * 24 * 7) {
await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { total: 1, fake: 1 } }, { upsert: true });
const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: invite.inviter.id });
const total = inviterData ? inviterData.total : 0;
kayitchannel.wsend(`${star} ${member} Sunucumuza katıldı fakar hesabı 7 günden önce açıldığı için şüpheli kısmına atıldı. ${red}`);
channel.wsend(`${member}, ${invite.inviter.tag} davetiyle katıldı! (**${total}**)`)
member.roles.set([ayar.fakeAccRole])
} else {
await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { total: 1, regular: 1 } }, { upsert: true });
const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: invite.inviter.id });
const total = inviterData ? inviterData.total : 0;
kayitchannel.wsend(`
${star} ${member} **Aramıza Hoşgeldin!**\n   
Seninle beraber **${üyesayısı}** kişiyiz.\n
Hesabın açılış süresi ${memberGün} ${memberAylar} ${memberTarih}  ${guvenilirlik ? `Şüpheli! ${red}` : `Güvenli! ${green}` }\n
${kurallar} kanalından kurallarımızı okumalısın. Sunucuya kayıt olduktan sonra kuralları okumuş kabul edeceğiz ve içeride yapılan cezaişlemlerde bunu göz önünde bulunduracağız.\n
Seni Davet Eden : ${invite.inviter.tag}. (**${total}** davet) :tada: :tada: :tada: `);
channel.wsend(`${member}, ${invite.inviter.tag} davetiyle katıldı! (**${total}**)`)
}
await coin.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { coin: 1 } }, { upsert: true });
const gorevData = await gorev.findOne({ guildID: member.guild.id, userID: invite.inviter.id });
if (gorevData)
{
await gorev.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { invite: 1 } }, { upsert: true });
}
};

module.exports.conf = {
  name: "guildMemberAdd",
};