let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  let moneda = user.moneda || '💴'
  let coin = user.yen || 0

  const cooldown = 24 * 60 * 60 * 1000
  const last = user.lastclaim || 0
  const now = Date.now()

  if (now - last < cooldown) {
    let wait = cooldown - (now - last)
    let horas = Math.floor(wait / 3600000)
    let minutos = Math.floor((wait % 3600000) / 60000)
    let segundos = Math.floor((wait % 60000) / 1000)
    return m.reply(
      `⏳ Ya reclamaste tu recompensa diaria.\n` +
      `Vuelve a intentarlo en ${horas}h ${minutos}m ${segundos}s.`
    )
  }

  const premio = 1000
  user.yen = coin + premio
  user.lastclaim = now

  m.reply(
    `¡Felicidades! Has reclamado tu recompensa diaria de:\n` +
    `${moneda} *+${premio}*\n\n` +
    `💴 Yenes totales: *${user.yen}*`
  )
}

handler.help = ['claim']
handler.tags = ['rpg']
handler.command = ['claim']
handler.register = true

export default handler