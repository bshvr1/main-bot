const client = global.client;
const inviterSchema = require("../schemas/inviter");
const inviteMemberSchema = require("../schemas/inviteMember");
const coin = require("../schemas/coin");
const conf = require("../configs/sunucuayar.json")
module.exports = async (member) => {
  const channel = member.guild.channels.cache.get(conf.invLogChannel);
  if (!channel) return;
  if (member.user.bot) return;

  const inviteMemberData = await inviteMemberSchema.findOne({ guildID: member.guild.id, userID: member.user.id });
  if (!inviteMemberData) {
    channel.wsend(`\`${member.user.tag}\` sunucumuzdan ayrıldı ama kim tarafından davet edildiğini bulamadım.`);
  } else {
    const inviter = await client.users.fetch(inviteMemberData.inviter);
    await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { leave: 1, total: -1 } }, { upsert: true });
    const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: inviter.id, });
    const total = inviterData ? inviterData.total : 0;
    channel.wsend(`\`${member.user.tag}\` sunucumuzdan ayrıldı. ${inviter.tag} tarafından davet edilmişti. (**${total}** davet)`);
    await coin.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { coin: -1 } }, { upsert: true });
  }
};

module.exports.conf = {
  name: "guildMemberRemove",
};