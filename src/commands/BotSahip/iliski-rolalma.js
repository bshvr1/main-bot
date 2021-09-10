const Discord = require("discord.js");
const conf = require("../../configs/sunucuayar.json");

module.exports = {
  conf: {
    aliases: [],
    name: "iliskirolalma",
    owner: true,
  },

  run: async (client, message, args) => {
    client.api.channels(conf.iliskirolalmakanal).messages.post({ data: {"content":"Aşağıdaki menüden kendinize uygun ilişki durumunuzu seçebilirsiniz.","components":[{"type":1,"components":[

        {"type":2,"style":2,"custom_id":"buttonsevgilimvar","label":"Sevgilim Var"},
        {"type":2,"style":4,"custom_id":"buttonsevgilimyok","label":"Sevgilim Yok"},
        {"type":2,"style":3,"custom_id":"buttonlgbt","label":"LGBT"}
        ]}]} })
  },
};

  