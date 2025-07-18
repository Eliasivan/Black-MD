import db from '../lib/database.js'

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : m.quoted 
        ? m.quoted.sender 
        : m.sender

    if (who == conn.user.jid) return m.react('✖️')
    if (!(who in global.db.data.users)) 
        return m.reply(`${emoji} *El usuario no se encuentra en mi base de datos.*`)

    let user = global.db.data.users[who]
    let nombre = await conn.getName(who)

    let coin = (user.coin || 0).toLocaleString('en-US')
    let bank = (user.bank || 0).toLocaleString('en-US')
    let total = ((user.coin || 0) + (user.bank || 0)).toLocaleString('en-US')

    let texto = `
╭─〔 ᥫ᭡ 𝗜𝗡𝗙𝗢 𝗘𝗖𝗢𝗡𝗢́𝗠𝗜𝗖𝗔 ❀ 〕
│ 👤 Usuario » *${nombre}*
│ 💸 Dinero » *¥${coin} ${moneda}*
│ 🏦 Banco » *¥${bank} ${moneda}*
│ 🧾 Total » *¥${total} ${moneda}*
╰─────────────────────
> 📌 Usa *${usedPrefix}deposit* para proteger tu dinero en el banco.
    `.trim()

    await conn.reply(m.chat, texto, m)
}

handler.help = ['bal']
handler.tags = ['rpg']
handler.command = ['bal', 'balance', 'bank']
handler.register = true
handler.group = true

export default handler
