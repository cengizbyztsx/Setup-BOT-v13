const moment = require("moment");
require("moment-duration-format");
const conf = require("../../configs/sunucuayar.json");
let serverSettings = require ("../../models/sunucuayar");
const voiceUserParent = require("../../schemas/voiceUserParent");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const cezapuan = require("../../schemas/cezapuan");
const coin = require("../../schemas/coin");
const taggeds = require("../../schemas/taggeds");
const yetkis = require("../../schemas/yetkis");
const ceza = require("../../schemas/ceza");
const toplams = require("../../schemas/toplams");
const inviterSchema = require("../../schemas/inviter");
const gorev = require("../../schemas/invite");
let { Stats, Seens } = require('../../schemas/Tracking');
const {  rewards, miniicon, mesaj2, staff, galp ,Muhabbet ,star , fill, empty, fillStart, emptyEnd, fillEnd, red } = require("../../configs/emojis.json");
const { TeamMember, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  conf: {
    aliases: ["ystat"],
    name: "yetkim",
    help: "yetkim"
  },

  run: async (client, message, args, embed) => {

      if (!message.guild) return;
      let conf = await serverSettings.findOne({
        guildID: message.guild.id
    });

    if(!conf.staffs.some(rol => message.member.roles.cache.has(rol))) return message.react(red)
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!conf.staffs.some(rol => member.roles.cache.has(rol))) return message.react(red)

    const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.user.id });
    const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.user.id });
    const messageWeekly = messageData ? messageData.weeklyStat : 0;
    const messageDaily = messageData ? messageData.dailyStat : 0;
    let seens = await Seens.findOne({userID: member.user.id});
    
    const coinData = await coin.findOne({ guildID: message.guild.id, userID: member.user.id });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });

 

    const maxValue = client.ranks[client.ranks.indexOf(client.ranks.find(x => x.coin >= (coinData ? coinData.coin : 0)))] || client.ranks[client.ranks.length-1];
    const taggedData = await taggeds.findOne({ guildID: message.guild.id, userID: member.user.id });
    const toplamData = await toplams.findOne({ guildID: message.guild.id, userID: member.user.id });
    const yetkiData = await yetkis.findOne({ guildID: message.guild.id, userID: member.user.id });
    const cezaData = await ceza.findOne({ guildID: message.guild.id, userID: member.user.id });


const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total = inviterData ? inviterData.total : 0;
    

        const category = async (parentsArray) => {
        const data = await voiceUserParent.find({ guildID: message.guild.id, userID: member.id });
        const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
        let voiceStat = 0;
        for (var i = 0; i <= voiceUserParentData.length; i++) {
          voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
        }
        return moment.duration(voiceStat).format("H [saat], m [dakika]");
      };
      
      let currentRank = client.ranks.filter(x => (coinData ? coinData.coin : 0) >= x.coin);
      currentRank = currentRank[currentRank.length-1];

      const coinStatus = message.member.hasRole(conf.staffs, false) && client.ranks.length > 0 ?
      `${currentRank ?`
      ${currentRank !== client.ranks[client.ranks.length-1] ? `??u an ${Array.isArray(currentRank.role) ? currentRank.role.map(x => `<@&${x}>`).join(", ") : `<@&${currentRank.role}>`} rol??ndesiniz. ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ' ve ' + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rol??ne ula??mak i??in \`${maxValue.coin-coinData.coin}\` puan daha kazanman??z gerekiyor!` : "??u an son yetkidesiniz! Emekleriniz i??in te??ekk??r ederiz. :)"}` : ` 
      \`??? Yetki Durumu     :\` ${message.member.roles.highest}`}` : ""    


    var PuanDetaylari = new MessageButton()
    .setLabel("Puan Detaylar??")
    .setCustomId("puan_detaylari")
    .setStyle("SUCCESS")
    .setEmoji("907014785386840075")

    var GenelPuanDetaylari = new MessageButton()
    .setLabel("Genel Puan")
    .setCustomId("genel_puan_detaylari")
    .setStyle("DANGER")
    .setEmoji("943107807312482304")

    var Iptal = new MessageButton()
    .setLabel("??ptal")
    .setCustomId("iptal_button")
    .setStyle("SECONDARY")
    .setEmoji("920412153712889877")

    const row = new MessageActionRow()
    .addComponents([PuanDetaylari, GenelPuanDetaylari, Iptal])

embed.setDescription(`${member.toString()}, (${member.roles.highest}) ??yesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda toplam ses ve mesaj bilgileri a??a????da belirtilmi??tir.`)
.addFields(
{ name: "__**Toplam Ses**__",  value: `\`\`\`fix\n${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true },
{ name: "__**Toplam Mesaj**__",  value: `\`\`\`fix\n${messageData ? messageData.topStat : 0} mesaj\n\`\`\``, inline: true },
{ name:"__**Toplam Kay??t**__",  value: `\`\`\`fix\n${toplamData ? `${toplamData.toplams.length} ki??i`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
)
.addFields(
{ name: "__**Toplam Davet**__", value: `\`\`\`fix\n${inviterData ? `${total} regular`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
{ name: "__**Toplam Tagl??**__", value: `\`\`\`fix\n${taggedData ? `${taggedData.taggeds.length} ki??i`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
{ name: "__**Toplam Yetkili**__", value: `\`\`\`fix\n${yetkiData ? `${yetkiData.yetkis.length} ki??i` : "Veri bulunmuyor."}\n\`\`\``, inline: true }
)
embed.addField(`${star} **Sesli Sohbet ??statisti??i**`, `
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Public Odalar: \`${await category(conf.publicParents)}\`
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Secret Odalar: \`${await category(conf.privateParents)}\`
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Alone Odalar: \`${await category(conf.aloneParents)}\`
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Y??netim Yetkili Odalar??: \`${await category(conf.funParents)}\`
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Kay??t Odalar??: \`${await category(conf.registerParents)}\`
   `, false)
embed.addField(`${star} **Mesaj ??statisti??i**`, `
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Toplam: \`${messageData ? messageData.topStat : 0}\`
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Haftal??k Mesaj: \`${Number(messageWeekly).toLocaleString()} mesaj\`
  ${client.emojis.cache.find(x => x.name === "mavinokta")} G??nl??k Mesaj: \`${Number(messageDaily).toLocaleString()} mesaj\`
   `, false)

   

    let msg = await message.channel.send({ embeds: [embed], components: [row] });

    var filter = (button) => button.user.id === message.author.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 99999999 })

    collector.on("collect", async (button) => {
      if(button.customId === "puan_detaylari") {
        await button.deferUpdate();

      const puan = new MessageEmbed()
      .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true })})
      .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
      .setDescription(`
      ${member.toString()} adl?? ??yenin stat durumu;

      ${client.emojis.cache.find(x => x.name === "unlem")} **Genel Bilgiler;**

      \`??? Son aktifli??i     :\` ${seens.lastSeenVoice ? `<t:${String(seens.lastSeenVoice ? seens.lastSeenVoice : Date.now()).slice(0, 10)}:R>` : "Son Seste G??r??lme Bulunamad??!"}
      \`??? ??lerleme Durumu    :\` ${progressBar(coinData ? coinData.coin : 0, maxValue.coin, 9)} \`${coinData ? coinData.coin : 0} / ${maxValue.coin}\`

      Yetkinin, y??kseltim toplant??s??nda y??kselir duruma gelmesi i??in de??erlendirme k??sm??n ye??il olmal?? ve ??lerleme durumu ??ubu??unda minimum %80 doldurmal??s??n.

      ${client.emojis.cache.find(x => x.name === "unlem")} **Yetki Durumu;**
      
       \`??? Yetki ??lerleme Durumu: \` ${progressBar(coinData ? coinData.coin : 0, maxValue.coin, 9)} \`${coinData ? coinData.coin : 0} / ${maxValue.coin}\`
      Puan??n??z: \`${coinData ? Math.floor(coinData.coin) : 0}\`, Gereken Puan: \`${maxValue.coin}\`
      ${coinStatus}
      `) 
      

      
      





msg.edit({
  embeds : [puan],
  components : [row]
})
      
      }

  if(button.customId === "genel_puan_detaylari") {
    await button.deferUpdate();
    const ceza = new MessageEmbed()
    .setDescription(`
    ${member.toString()}, (${member.roles.highest}) ??yesinin \`${moment(Date.now()).format("LLL")}\` tarihinden itibaren \`${message.guild.name}\` sunucusunda genel puanlama tablosu a??a????da belirtilmi??tir.
`) 
.addField(`${star} **Puan Detaylar??:**`, `
${client.emojis.cache.find(x => x.name === "mavinokta")} Kay??t: (\`Puan Etkisi: +${toplamData ? toplamData.toplams.length*5.5 : 0}\`)
${client.emojis.cache.find(x => x.name === "mavinokta")} Tagl??: (\`Puan Etkisi: +${taggedData ? taggedData.taggeds.length*25 : 0}\`)
${client.emojis.cache.find(x => x.name === "mavinokta")} Davet: (\`Puan Etkisi: +${total*15}\`)
${client.emojis.cache.find(x => x.name === "mavinokta")} Yetkili: (\`Puan Etkisi: +${yetkiData ? yetkiData.yetkis.length*30 : 0}\`)
${client.emojis.cache.find(x => x.name === "mavinokta")} Toplam Ses: (\`Puan Etkisi: +${moment.duration(voiceData ? voiceData.topStat : 0).format("h")*240}\`)
${client.emojis.cache.find(x => x.name === "mavinokta")} Toplam Mesaj: (\`Puan Etkisi: +${messageData ? messageData.topStat*2 : 0}\`)
${client.emojis.cache.find(x => x.name === "mavinokta")} Toplam Ald??????n Cezalar : ${cezapuanData ? cezapuanData.cezapuan.length : 0} (\`Toplam ${cezaData ? cezaData.ceza.length : 0}\`)
 `, false)

.addField(`${star} **Net Puanlama Bilgisi**`, `
${client.emojis.cache.find(x => x.name === "mavinokta")} Kay??t i??lemi yaparak, \`+5.5\` puan kazan??rs??n.
${client.emojis.cache.find(x => x.name === "mavinokta")} Tagl?? ??ye belirleyerek, \`+25\` puan kazan??rs??n??z.
${client.emojis.cache.find(x => x.name === "mavinokta")} ??nsanlar?? davet ederek, \`+15\` puan kazan??rs??n.
${client.emojis.cache.find(x => x.name === "mavinokta")} ??nsanlar?? yetkili yaparak, \`+30\` puan kazan??rs??n.
${client.emojis.cache.find(x => x.name === "mavinokta")} Seste kalarak, ortalama olarak \`+4\` puan kazan??rs??n??z.
${client.emojis.cache.find(x => x.name === "mavinokta")} Yaz?? yazarak, ortalama olarak, \`+2\` puan kazan??rs??n??z.
 `, false)

.addField(`${star} **Puan Durumu:**`, `
Puan??n??z: \`${coinData ? Math.floor(coinData.coin) : 0}\`, Gereken Puan: \`${maxValue.coin}\`
${progressBar(coinData ? coinData.coin : 0, maxValue.coin, 9)} \`${coinData ? coinData.coin : 0} / ${maxValue.coin}\`
 `, false)

.addField(`${star} **Yetki Durumu:**`, `
${coinStatus}
 `, false)

msg.edit({
  embeds: [ceza],
  components : [row]
})  
    }

      if(button.customId === "iptal_button") {
        await button.deferUpdate();
        const iptal = new MessageEmbed()
        .setDescription(`
${member.toString()}, (${member.roles.highest}) ??yesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda toplam ses ve mesaj bilgileri a??a????da belirtilmi??tir.
`)

.addFields(
  { name: "__**Toplam Ses**__",  value: `\`\`\`fix\n${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true },
  { name: "__**Toplam Mesaj**__",  value: `\`\`\`fix\n${messageData ? messageData.topStat : 0} mesaj\n\`\`\``, inline: true },
  { name:"__**Toplam Kay??t**__",  value: `\`\`\`fix\n${toplamData ? `${toplamData.toplams.length} ki??i`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
  )
  .addFields(
  { name: "__**Toplam Davet**__", value: `\`\`\`fix\n${inviterData ? `${total} regular`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
  { name: "__**Toplam Tagl??**__", value: `\`\`\`fix\n${taggedData ? `${taggedData.taggeds.length} ki??i`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
  { name: "__**Toplam Yetkili**__", value: `\`\`\`fix\n${yetkiData ? `${yetkiData.yetkis.length} ki??i` : "Veri bulunmuyor."}\n\`\`\``, inline: true }
  )
  
  .addField(`${star} **Sesli Sohbet ??statisti??i**`, `
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Public Odalar: \`${await category(conf.publicParents)}\`
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Secret Odalar: \`${await category(conf.privateParents)}\`
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Alone Odalar: \`${await category(conf.aloneParents)}\`
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Y??netim Yetkili Odalar??: \`${await category(conf.funParents)}\`
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Kay??t Odalar??: \`${await category(conf.registerParents)}\`
   `, false)
  
  
  .addField(`${star} **Mesaj ??statisti??i**`, `
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Toplam: \`${messageData ? messageData.topStat : 0}\`
  ${client.emojis.cache.find(x => x.name === "mavinokta")} Haftal??k Mesaj: \`${Number(messageWeekly).toLocaleString()} mesaj\`
  ${client.emojis.cache.find(x => x.name === "mavinokta")} G??nl??k Mesaj: \`${Number(messageDaily).toLocaleString()} mesaj\`
   `, false);

   row.components[0].setDisabled(true) 
   row.components[1].setDisabled(true) 
   row.components[2].setDisabled(true)
   
    msg.edit({
      embeds: [iptal],
      components : [row]
    })
        
        }

  })
  }
};

function progressBar(value, maxValue, size) {
const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
const emptyProgress = size - progress > 0 ? size - progress : 0;

const progressText = fill.repeat(progress);
const emptyProgressText = empty.repeat(emptyProgress);

return emptyProgress > 0 ? fillStart+progressText+emptyProgressText+emptyEnd : fillStart+progressText+emptyProgressText+fillEnd;
};
