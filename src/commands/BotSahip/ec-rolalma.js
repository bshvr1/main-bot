const Discord = require("discord.js");
const conf = require("../../configs/sunucuayar.json");

module.exports = {
  conf: {
    aliases: [],
    name: "ecrolalma",
    owner: true,
  },

  run: async (client, message, args) => {
    client.api.channels(conf.ecrolalmakanal).messages.post({ data: {"content":"Aşağıdaki menüden kendinize oyun seçebilirsiniz. Bir oyunun rolünü almak için o butona tıklayın.","components":[{"type":1,"components":[

        {"type":2,"style":2,"custom_id":"buttoncekilis","label":"Çekiliş Katılımcısı"},
        {"type":2,"style":4,"custom_id":"buttonetkinlik","label":"Etkinlik Katılımcısı"}
        
        ]}]} })
  },
};

  