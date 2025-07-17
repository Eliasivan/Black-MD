import { createHash } from 'crypto'
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, usedPrefix, command }) {
  let user = global.db.data.users[m.sender]
  let name2 = conn.getName(m.sender)
  if (user.registered === true) throw `「👑」 *Ya estas registrado*\n\n◉ 🍟 ¿Quiere volver a registrarse?\n\n◉ 🍭 Para volver a registrarse *elimine su registro* haciendo uso del comando\n*${usedPrefix}unreg*`
  if (!Reg.test(text)) throw `「👑」 *Formato incorrecto*\n\n◉ 🍟 *${usedPrefix + command} nombre.edad*\n\n> [ 💡 ] Ejemplo : *${usedPrefix + command}* ${name2}.18`
  let [_, name, splitter, age] = text.match(Reg)
  if (!name) throw '「👑」 *El nombre no puede estar vacio*'
  if (!age) throw '「👑」 *La edad no puede estar vacía*'
  if (name.length >= 30) throw '*「👑」 *El nombre es demasiado largo*' 
  age = parseInt(age)
  if (age > 100) throw '*Pellé quiere jugar con el bot?*'
  if (age < 5) throw '*Eres menor no  puedes registrarte en BaileyBot-MD*'
  user.name = name.trim()
  user.age = age
  user.regTime = + new Date
  user.registered = true
  global.db.data.users[m.sender].money += 600
  global.db.data.users[m.sender].limit += 20
  global.db.data.users[m.sender].exp += 500
  global.db.data.users[m.sender].joincount += 100
 let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6)    
m.react('📩') 
let regbot = `👤 𝗥 𝗘 𝗚 𝗜 𝗦 𝗧 𝗥 𝗢 👤
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
『💭』𝗡𝗼𝗺𝗯𝗿𝗲: ${name}
『✨️』𝗘𝗱𝗮𝗱: ${age} años
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
『🎁』𝗥𝗲𝗰𝗼𝗺𝗽𝗲𝗻𝘀𝗮𝘀:
• 30 Yenes
• 5 Coins 🪙
• 245 Experiencia 💸
• 12 Tokens 💰
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
`
conn.sendMessage(m.chat, {
text: regbot,
contextInfo: {
externalAdReply: {
title: '༺『✅𝆺𝅥 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗔𝗗𝗢 𝆹𝅥✅』༻',
/*body: wm, 
thumbnaiUrl: md, 
sourceUrl: channel,
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: true,
}}}, { quoted: fkontak })
//await m.reply(`${sn}`)        
}*/
handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'] 

export default handler