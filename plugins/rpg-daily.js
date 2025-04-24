const free = 25
const prem = 15
var handler = async (m, {conn, isPrems }) => {
  let coin = `${pickRandom([5, 6, 7, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 99, 100, 110, 120, 130, 600, 1000, 1500])}` * 1
  let exp = `${pickRandom([500, 600, 700, 800, 900, 999, 1000, 1300, 1500, 1800])}` * 1
  let exppremium = `${pickRandom([1000, 1500, 1800, 2100, 2500, 2900, 3300, 3600, 4000, 4500])}` * 1
  let d = Math.floor(Math.random() * 30)
  global.db.data.users[m.sender].diamond += d
  global.db.data.users[m.sender].money += d
  global.db.data.users[m.sender].exp += isPrems ? exppremium : exp
  let texto = `🎁 *Recompensa Diaria* Recursos: ✨ Xp : *+${isPrems ? exppremium : exp}* 💎 Diamantes : *+${d}* ❤️‍🔥 BlackCoins : *+${coin}*`
  await conn.sendMessage(m.chat, { text: texto }, { quoted: m })
  await conn.sendMessage(m.chat, {
    text: '¿Qué deseas hacer ahora?',
    buttons: [
      { buttonId: '.w', buttonText: { displayText: 'Trabajar ⛏️' }},
      { buttonId: '.cofre', buttonText: { displayText: 'Cofre 🪙' }}
    ]
  })
}
await conn.sendButton(m.chat, texto, wm, img, [['🔰 𝙼𝙴𝙽𝚄', '/menu'] ], fkontak, m)
handler.help = ['daily', 'claim']
handler.tags = ['rpg']
handler.command = ['daily', 'claim']
handler.group = true
handler.register = true

export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}