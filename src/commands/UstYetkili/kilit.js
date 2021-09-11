const conf = require("../../configs/sunucuayar.json")
module.exports = {
  conf: {
    aliases: ["kilit","lock"],
    name: "kilit",
    help: "kilit"
  },

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
    if (message.channel.permissionsFor(message.guild.roles.everyone).has("SEND_MESSAGES")) {
      message.channel.updateOverwrite(message.guild.roles.everyone, {
        SEND_MESSAGES: false,
      });
      message.react("🔒")
      message.lineReply("🔒 Kanal kilitlendi!").then(x=>x.delete({timeout: 10000}))
    } else {
      message.channel.updateOverwrite(message.guild.roles.everyone, {
        SEND_MESSAGES: null,
      });
      message.react("🔓")
      message.lineReply("🔓 Kanal kilidi açıldı!").then(x=>x.delete({timeout:10000}))
    }
  },
};

