let handler = async (m, { conn, usedPrefix }) => {
  let userId = m.sender
  let bot = global.conn.user
  let coin = global.db.data.users[userId].coin || 0
  let moneda = 'Yenes'

  let menu = `¡Hola, @${userId.split('@')[0]}! tienes ${moneda} *${coin}*`.trim()

  await conn.sendMessage(m.chat, {
    text: menu,
    mentions: [userId]
  }, { quoted: m })
}

handler.help = ['info']
handler.tags = ['info']
handler.command = ['infoyenes']

export default handler