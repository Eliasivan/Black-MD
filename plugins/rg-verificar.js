import { createHash } from 'crypto'
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let user = global.db.data.users[m.sender]
  let name2 = conn.getName(m.sender)

  if (user.registered === true) 
    throw `「👑」 *Ya estás registrado*\n\n◉ 🍟 ¿Quieres volver a registrarte?\n\n◉ 🍭 Usa el comando *${usedPrefix}unreg* para eliminar tu registro.`

  if (!Reg.test(text)) 
    throw `「👑」 *Formato incorrecto*\n\n◉ 🍟 Usa: *${usedPrefix + command} nombre.edad*\n\n> [ 💡 ] Ejemplo: *${usedPrefix + command}* ${name2}.18`

  let [_, name, splitter, age] = text.match(Reg)

  if (!name) throw '「👑」 *El nombre no puede estar vacío*'
  if (!age) throw '「👑」 *La edad no puede estar vacía*'
  if (name.length >= 30) throw '「👑」 *El nombre es demasiado largo*'

  age = parseInt(age)
  if (age > 100) throw '*¿Pelé quiere jugar con el bot?*'
  if (age < 5) throw '*Eres menor, no puedes registrarte en el bot*'

  user.name = name.trim()
  user.age = age
  user.regTime = +new Date()
  user.registered = true
  user.money += 600
  user.limit += 20
  user.exp += 500
  user.joincount += 100

  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6)    
  m.react('📩') 

  let regbot = `👤 𝗥 𝗘 𝗚 𝗜 𝗦 𝗧 𝗥 𝗢 👤
•━━━━━━━━━━━━━━•
『💭』𝗡𝗼𝗺𝗯𝗿𝗲: ${name}
『✨️』𝗘𝗱𝗮𝗱: ${age} años
•━━━━━━━━━━━━━━•
『🎁』𝗥𝗲𝗰𝗼𝗺𝗽𝗲𝗻𝘀𝗮𝘀:
• 10 Estrellas 🌟
• 5 Coins 🪙
• 245 Experiencia 💸
• 12 Tokens 💰
•━━━━━━━━━━━━━━•`

  conn.sendMessage(m.chat, {
    text: regbot,
    contextInfo: {
      externalAdReply: {
        title: '✅ Registro exitoso',
        body: '¡Bienvenido!',
        mediaType: 1,
        showAdAttribution: false,
        renderLargerThumbnail: true,
      }
    }
  }, { quoted: m })
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'] 

export default handler
