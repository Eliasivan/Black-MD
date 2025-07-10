let handler = async (m, { conn, usedPrefix }) => {
  let userId = m.sender
  let bot = global.conn.user
  let coin = global.db.data.users[userId].coin || 0
  let moneda = '💸'

  let menu = `
╭━━〔 *Menú Principal* 〕━━⬣
┃ ¡Hola, @${userId.split('@')[0]}!
┃ Monedas: ${moneda} *+${coin}*
┃
┃ *Comandos principales:*
┃ ➤ ${usedPrefix}menu
┃ ➤ ${usedPrefix}infobot
╰━━━━━━━〔 Goku Black 〕━━━━⬣
`.trim()

  await conn.sendMessage(m.chat, {
    text: menu,
    mentions: [userId]
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['help']

export default handler