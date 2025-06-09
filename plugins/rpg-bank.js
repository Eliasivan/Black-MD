import db from '../lib/database.js'

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
    if (who == conn.user.jid) return m.react('✖️')
    if (!(who in global.db.data.users)) return m.reply(`✨ El usuario no se encuentra en mi base de datos.`)

    let user = global.db.data.users[who]
    let total = (user.estrella || 0) + (user.bank || 0);

    const texto = `🌟 Información - Economía ✨
  
🌠 Usuario » *${conn.getName(who)}*   
⭐ Estrellas » *${user.estrella || 0} estrellas*
🏦 Banco » *${user.bank || 0} estrellas*
🌌 Total » *${total} estrellas*

> *Para proteger tus estrellas, ¡depósitalas en el banco usando #deposit!*`;

    await conn.reply(m.chat, texto, m)
}

handler.help = ['bal']
handler.tags = ['rpg']
handler.command = ['bal', 'balance', 'bank'] 
handler.register = true 
handler.group = true 

export default handler