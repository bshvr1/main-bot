const bannedTag = require("../../schemas/bannedTag");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const penals = require("../../schemas/penals");
const conf = require("../../configs/sunucuayar.json")
const settings = require("../../configs/settings.json")
module.exports = {
  conf: {
    aliases: ["yasaklı-tag", "bannedtag","ytag"],
    name: "yasaklıtag",
    help: "yasaklıtag [ekle/sil] [tag] / [say/liste]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;

    const data = await bannedTag.findOne({ guildID: message.guild.id });
    if (["ekle", "add"].includes(args[0])) {
      if (!args[1]) return message.channel.send("Bir tag giriniz!").then(x=>x.delete({timeout:5000}))
      const filtered = message.guild.members.cache.filter((x) => x.user.username.includes(args[1]) && !conf.jailRole.some((a) => x.roles.cache.has(a)));
      if (data && data.tags.length > 0 && data.tags.some((x) => x.tag === args[1])) return message.channel.send(`${args[1]} tagı zaten yasaklı taglar arasında!`).then(x=>x.delete({timeout:5000}))
      await bannedTag.findOneAndUpdate({ guildID: message.guild.id }, { $push: { tags: args[1] } }, { upsert: true });
      message.channel.send(`Başarıyla ${args[1]} tagı yasaklı taglar arasına eklendi ve ${filtered.size} kişi jaile atıldı!`).then(x=>x.delete({timeout:5000}))
      filtered.forEach(async (x) => {
        await x.setRoles(conf.jailRole);
        const penal = await client.penalize(message.guild.id, x.user.id, "JAIL", true, client.user.id, `Kullanıcı adında yasaklı tag (\`${args[1]}\`) bulundurmak.`);
        if (settings.dmMessages) x.send(`**${message.guild.name}** sunucusunda, kullanıcı adınızda yasaklı tag (\`${args[1]}\`) bulundurduğunuz için jaillendiniz!`).catch(() => {});
        message.guild.channels.cache.get(conf.jailLogChannel).send(`${x.toString()}, kullanıcı adınızda yasaklı tag (\`${args[1]}\`) bulundurduğunuz için jaillendiniz!`);

        const log = new MessageEmbed()
          .setAuthor(x.user.username, x.user.avatarURL({ dynamic: true, size: 2048 }))
          .setColor("#2f3136")
          .setDescription(`
${x.toString()} üyesi jaillendi!

Ceza ID: \`#${penal.id}\`
Jaillenen Üye: ${x.toString()} \`(${x.user.username.replace(/`/g, "")} - ${x.user.id})\`
Jailleyen Yetkili: <@${client.user.id}> \`(${client.user.username} - ${client.user.id})\`
Jail Tarihi: \`${moment(Date.now()).format("LLL")}\`
Jail Sebebi: \`Kullanıcı adında yasaklı tag (${args[1]}) bulundurmak.\`
          `);
        message.guild.channels.cache.get(conf.jailLogChannel).send(log);
      });
    } else if (["sil", "remove"].includes(args[0])) {
      if (!args[1]) return message.channel.send( "Bir tag giriniz!");
      if (!data.tags.includes(args[1])) return message.channel.send(`Sunucunun yasaklı tagları arasında ${args[1]} tagı bulunmuyor!`).then(x=>x.delete({timeout:5000}))
      data.tags = data.tags.filter((x) => !x.includes(args[1]));
      data.save();
      const filtered = message.guild.members.cache.filter((x) => x.user.username.includes(args[1]) && conf.jailRole.some((a) => x.roles.cache.has(a)));
      message.channel.send(embed.setDescription(`Başarıyla ${args[1]} tagı yasaklı taglar arasından kaldırıldı ve ${filtered.size} kişi kayıtsıza atıldı!`)).then(x=>x.delete({timeout:5000}))
      filtered.forEach(async (x) => {
        const data = await penals.findOne({ userID: x.user.id, guildID: message.guild.id, type: "JAIL", active: true });
        if (data) {
          data.active = false;
          await data.save();
        }
        await x.setRoles(conf.unregRoles);
        if (settings.dmMessages) x.send(`**${message.guild.name}** sunucusunda, ${args[1]} tagı yasaklı taglar arasından kaldırıldı ve jailiniz açıldı.`).catch(() => {});

        const log = new MessageEmbed()
          .setAuthor(x.user.username, x.user.avatarURL({ dynamic: true, size: 2048 }))
          .setColor("#2f3136")
          .setDescription(`
${x.toString()} üyesinin jaili kaldırıldı!

Jaili Kaldırılan Üye: ${x.toString()} \`(${x.user.username.replace(/`/g, "")} - ${x.user.id})\`
Jaili Kaldıran Yetkili: <@${client.user.id}> \`(${client.user.username} - ${client.user.id})\`
Jailin Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\`
          `);
        message.guild.channels.cache.get(conf.jailLogChannel).send(log);
      });
    } else if (["list", "liste"].includes(args[0])) {
      if (!data || data && !data.tags.length) return message.channel.send( "Sunucuda herhangi bir yasaklı tag bulunmuyor!").then(x=>x.delete({timeout:5000}))
      const filtered = message.guild.members.cache.filter((x) => new RegExp(data.tags.map((x) => x.tag).join("|"), "g").test(x.user.username));
      message.channel.send(embed.setDescription(`
\`${message.guild.name}\` sunucusunun yasaklı tagları;
${data.tags.map((x) => `\`${x}\``).join(", ")}
Toplam ${filtered.size} kişide ${data.tags.length > 1 ? data.tags.slice(0, -1).map(x => x).join(", ") + " veya " + data.tags.map(x => x).slice(-1) : data.tags.map(x => x).join("")} tagları bulunuyor!
      `));
    }
  },
};
