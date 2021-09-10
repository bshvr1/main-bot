const { Client, Collection, Discord, MessageEmbed } = require("discord.js");
require("discord-reply")
const client = (global.client = new Client({ fetchAllMembers: true }));
require('discord-buttons')(client)
const settings = require("./src/configs/settings.json");
const fs = require("fs");
client.commands = new Collection();
client.aliases = new Collection();
client.invites = new Collection();
client.cooldown = new Map();

//RANK KISMI//
client.ranks = [
  { role: "861216469655617546", coin: 2000 },
  { role: "861216468841398272", coin: 3000 },
  { role: "861216466376327168", coin: 4000 },
  { role: "861216465729748992", coin: 5000 },
  { role: "861216465008459776", coin: 6000 },
  { role: "861216462630682635", coin: 7000 }
  ]
//KOMUT ÇALIŞTIRMA
fs.readdir('./src/commands/', (err, files) => {
  if (err) console.error(err);
  console.log(`[AIAS] ${files.length} komut yüklenecek.`);
  files.forEach(f => {
    fs.readdir("./src/commands/" + f, (err2, files2) => {
      files2.forEach(file => {
        let props = require(`./src/commands/${f}/` + file);
        console.log(`[AIAS KOMUT] ${props.conf.name} komutu yüklendi!`);
        client.commands.set(props.conf.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.conf.name);
        });
      })
    })
  });
});
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");
require("./src/handlers/functionHandler")(client);

client
  .login(settings.token)
  .then(() => console.log("Bot Başarıyla Bağlandı!"))
  .catch(() => console.log("[HATA] Bot Bağlanamadı!"));



  client.on("userUpdate", async function(oldUser, newUser) { // kod codaredan alınıp editlenmiştir!
    const guildID = "853341587107217419"//sunucu
    const roleID = "861216477348888607"//taglırolü
    const tag = "Wâke"//tag
    const chat = '861216515352166400'// chat
    const log2 = '861251750991888454' // log kanalı
  
    const guild = client.guilds.cache.get(guildID)
    const role = guild.roles.cache.find(roleInfo => roleInfo.id === roleID)
    const member = guild.members.cache.get(newUser.id)
    const embed = new MessageEmbed().setAuthor(member.displayName, member.user.avatarURL({ dynamic: true })).setColor('#ff0000').setTimestamp().setFooter('Aias Moruk ?');
    if (newUser.username !== oldUser.username) {
        if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
            member.roles.remove(roleID)
            if (oldUser.discriminator !== "1960" && newUser.discriminator == "1960") {
                member.roles.add(roleID) }
            client.channels.cache.get(log2).send(embed.setDescription(` ${newUser} isminden \`Wâke\` çıkartarak ailemizden ayrıldı!`))
        } if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
            member.roles.add(roleID)
            client.channels.cache.get(chat).send(`Tebrikler, ${newUser} tag alarak ailemize katıldı ona sıcak bir Merhaba! diyelim!.(${tag})`).then(x=>x.delete({timeout:5000}))
            client.channels.cache.get(log2).send(embed.setDescription(`  ${newUser} ismine \`Wâke\` alarak ailemize katıldı`))
        }
    }
   if (newUser.discriminator !== oldUser.discriminator) {
        if (oldUser.discriminator == "1960" && newUser.discriminator !== "1960") {
            member.roles.remove(roleID)
            if (!oldUser.username.includes(`Séc`) && newUser.username.includes(`Séc`)) {
                member.roles.add(roleID) }
            client.channels.cache.get(log2).send(embed.setDescription(`  ${newUser} etiketinden \`1960\` çıakrtarak ailemizden ayrıldı!`))
        } if (oldUser.discriminator !== "1960" && newUser.discriminator == "1960") {
            member.roles.add(roleID)
            client.channels.cache.get(log2).send(embed.setDescription(`  ${newUser} etiketine \`1960\` alarak ailemize katıldı`))
            client.channels.cache.get(chat).send(`Tebrikler, ${newUser} tag alarak ailemize katıldı ona sıcak bir **'Merhaba!'** diyelim!.(#0917)`).then(x=>x.delete({timeout:5000}))
        }
    }
  
  })

  client.on("userUpdate", async function(oldUser, newUser) { // kod codaredan alınıp editlenmiştir!
    const guildID = "853341587107217419"//sunucu
    const roleID = "861216477348888607"//taglırolü
    const tag = "wâke"//tag
    const chat = '861216515352166400'// chat
    const log2 = '861251750991888454' // log kanalı
  
    const guild = client.guilds.cache.get(guildID)
    const role = guild.roles.cache.find(roleInfo => roleInfo.id === roleID)
    const member = guild.members.cache.get(newUser.id)
    const embed = new MessageEmbed().setAuthor(member.displayName, member.user.avatarURL({ dynamic: true })).setColor('#ff0000').setTimestamp().setFooter('Aias Moruk ?');
    if (newUser.username !== oldUser.username) {
        if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
            member.roles.remove(roleID)
            client.channels.cache.get(log2).send(embed.setDescription(` ${newUser} isminden \`wâke\` çıkartarak ailemizden ayrıldı!`))
        } if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
            member.roles.add(roleID)
            client.channels.cache.get(chat).send(`Tebrikler, ${newUser} tag alarak ailemize katıldı ona sıcak bir Merhaba! diyelim!.(${tag})`).then(x=>x.delete({timeout:5000}))
            client.channels.cache.get(log2).send(embed.setDescription(`  ${newUser} ismine \`wâke\` alarak ailemize katıldı`))
        }
      }})


  client.on("guildMemberAdd", async (member) => {
    const tag = "Wake"
    const kanal = "861251750991888454"
    const rol = "861216477348888607"
      if (member.user.username.includes(tag)) {
        member.roles.add(rol)
        client.channels.cache.get(kanal).send(`<@${member.id}> adlı kişi sunucumuza taglı şekilde katıldı, isminde ${tag} sembolü bulunuyor.`)
    }})
 
