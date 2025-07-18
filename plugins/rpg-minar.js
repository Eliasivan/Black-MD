let cooldowns = {}

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  if (!user) return;

  const tiempoMinar = 10 * 60 * 1000
  let now = new Date()

  if (now - user.lastmiming < tiempoMinar) {
    let restante = msToTime(user.lastmiming + tiempoMinar - now)
    return conn.reply(m.chat, `⛏️ Aún te estás recuperando del último minado.\n⏳ Espera *${restante}* para volver a minar.`, m)
  }

  const esEventoPositivo = Math.random() < 0.75
  let resultado = ''

  const eventosBuenos = [
    {
      texto: '✨ Encontraste una veta gigante de esmeraldas!',
      cambios: () => ({
        exp: r(250, 500),
        coin: r(3000, 6000),
        emerald: r(5, 10),
        iron: r(20, 40),
        gold: r(10, 30),
        coal: r(40, 100),
        stone: r(300, 800),
      })
    },
    {
      texto: '💰 Abriste un cofre abandonado lleno de recursos!',
      cambios: () => ({
        exp: r(300, 700),
        coin: r(5000, 2999),
        emerald: r(2, 6),
        iron: r(10, 25),
        gold: r(5, 15),
        coal: r(30, 60),
        stone: r(200, 500),
      })
    },
    {
      texto: '💎 Descubriste una cueva secreta con riquezas antiguas!',
      cambios: () => ({
        exp: r(500, 900),
        coin: r(10000, 20000),
        emerald: r(10, 20),
        iron: r(30, 50),
        gold: r(20, 40),
        coal: r(60, 150),
        stone: r(500, 1000),
      })
    },
    {
      texto: '🔨 Tus golpes fueron precisos y extrajiste muchos minerales!',
      cambios: () => ({
        exp: r(100, 300),
        coin: r(1000, 3000),
        emerald: r(1, 3),
        iron: r(10, 20),
        gold: r(5, 10),
        coal: r(20, 50),
        stone: r(200, 400),
      })
    },
    {
      texto: '🍀 Hoy fue tu día de suerte, encontraste un mineral raro!',
      cambios: () => ({
        exp: r(300, 600),
        coin: r(6000, 10000),
        emerald: r(4, 8),
        iron: r(15, 30),
        gold: r(10, 20),
        coal: r(50, 90),
        stone: r(300, 700),
      })
    }
  ]

  const eventosMalos = [
    {
      texto: '💥 ¡Hubo una explosión dentro de la mina!',
      cambios: () => ({
        exp: r(50, 100),
        coin: -r(1000, 2000),
        emerald: -r(1, 2),
        iron: -r(5, 10),
        gold: -r(3, 6),
        coal: -r(10, 20),
        stone: -r(100, 200),
      })
    },
    {
      texto: '🥵 Te perdiste y no encontraste casi nada útil.',
      cambios: () => ({
        exp: r(30, 70),
        coin: -r(500, 1500),
        emerald: 0,
        iron: r(1, 3),
        gold: 0,
        coal: r(5, 10),
        stone: r(50, 100),
      })
    },
    {
      texto: '📉 Un derrumbe bloqueó el camino y perdiste parte del botín.',
      cambios: () => ({
        exp: r(70, 120),
        coin: -r(2000, 2000),
        emerald: -r(2, 4),
        iron: -r(10, 20),
        gold: -r(5, 10),
        coal: -r(20, 40),
        stone: -r(150, 300),
      })
    }
  ]

  const evento = esEventoPositivo
    ? pickRandom(eventosBuenos)
    : pickRandom(eventosMalos)

  const cambios = evento.cambios()

  user.coin = Math.max(0, user.coin + cambios.coin)
  user.iron = Math.max(0, user.iron + cambios.iron)
  user.gold = Math.max(0, user.gold + cambios.gold)
  user.emerald = Math.max(0, user.emerald + cambios.emerald)
  user.coal = Math.max(0, user.coal + cambios.coal)
  user.stone = Math.max(0, user.stone + cambios.stone)
  user.health = Math.max(0, user.health - 40)
  user.pickaxedurability = Math.max(0, user.pickaxedurability - 20)
  user.lastmiming = now * 1

  resultado =
    `⛏️ *${evento.texto}*\n\n` +
    `> *📦 Resultado del minado:*\n` +
    `✨ *Exp:* ${cambios.exp}\n` +
    `💸 *${moneda}:* ${formato(cambios.coin)}\n` +
    `♦️ *Esmeralda:* ${formato(cambios.emerald)}\n` +
    `🔩 *Hierro:* ${formato(cambios.iron)}\n` +
    `🏅 *Oro:* ${formato(cambios.gold)}\n` +
    `🕋 *Carbón:* ${formato(cambios.coal)}\n` +
    `🪨 *Piedra:* ${formato(cambios.stone)}`

  let img = 'https://files.catbox.moe/qfx5pn.jpg'
  await conn.sendFile(m.chat, img, 'minado.jpg', resultado, m)
  await m.react('⛏️')
}

handler.help = ['minar']
handler.tags = ['economy']
handler.command = ['minar', 'miming', 'mine']
handler.register = true
handler.group = true

export default handler

function r(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formato(num) {
  return num >= 0 ? `+${num}` : `-${Math.abs(num)}`
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function msToTime(duration) {
  var seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60)
  return `${minutes}m y ${seconds}s`
}
