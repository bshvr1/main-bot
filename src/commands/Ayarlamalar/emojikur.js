const { Database } = require("ark.db");
const db = new Database("/src/configs/emojis.json");

module.exports = {
  conf: {
    aliases: [],
    name: "emojikur",
    owner: true,
  },

  run: async (client, message, args) => {
    const emojis = [
        { name: "ates", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439806018879488/ates.gif" },
        { name: "tacc", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439808544243762/tacc.gif" },
        { name: "sonsuzkalp", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439863346364436/sonsuzkalp.gif" },
        { name: "star", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439871505072178/star.gif" },
        { name: "red", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439875170500629/red.gif" },
        { name: "green", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439878664486913/green.gif" },
        { name: "fill", url: "https://cdn.discordapp.com/emojis/836740227421700103.gif?v=1" },
        { name: "empty", url: "https://cdn.discordapp.com/emojis/836740057582534686.png?v=1" },
        { name: "fillStart", url: "https://cdn.discordapp.com/emojis/836740289841463336.gif?v=1" },
        { name: "emptyEnd", url: "https://cdn.discordapp.com/emojis/836740118092972062.png?v=1" },
        { name: "fillEnd", url: "https://cdn.discordapp.com/emojis/836740143602991144.gif?v=1" },
        { name: "xp", url: "https://cdn.discordapp.com/emojis/838468875825446922.gif?v=1" },
        { name: "gulucuk", url: "https://cdn.discordapp.com/emojis/838469248602865735.png?v=1" },
        { name: "mesaj2", url: "https://cdn.discordapp.com/emojis/838468915814334464.gif?v=1" },
        { name: "rewards", url: "https://cdn.discordapp.com/emojis/838468721516216350.gif?v=1" },
        { name: "altin", url: "https://cdn.discordapp.com/emojis/836694825243508756.gif?v=1" },
        { name: "altin2", url: "https://cdn.discordapp.com/emojis/836694821128372224.gif?v=1" },
        { name: "voice", url: "https://cdn.discordapp.com/emojis/841076020399308831.png?v=1" },
        { name: "channel", url: "https://cdn.discordapp.com/emojis/841076020399308831.png?v=1" },

    ]
    emojis.forEach(async (x) => {
      if (message.guild.emojis.cache.find((e) => x.name === e.name)) return db.set(x.name, message.guild.emojis.cache.find((e) => x.name === e.name).toString());
      const emoji = await message.guild.emojis.create(x.url, x.name);
      await db.set(x.name, emoji.toString());
      message.channel.send(`\`${x.name}\` isimli emoji oluşturuldu! (${emoji.toString()})`);
    });
    },
  };