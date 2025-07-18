let cooldowns = {}
let jail = {}

let handler = async (m, { conn }) => {
  let users = global.db.data.users
  let senderId = m.sender
  let senderName = conn.getName(senderId)
  let senderCoin = users[senderId].coin || 0

  const cooldown = 5 * 60 * 1000
  const jailCooldown = 60 * 60 * 1000

  if (jail[senderId] && Date.now() < jail[senderId]) {
    const restante = segundosAHMS(Math.ceil((jail[senderId] - Date.now()) / 1000))
    return m.reply(`🚔 Estás en la cárcel por crímenes fallidos.\n🧊 Tiempo restante: *${restante}*.`)
  }

  if (cooldowns[senderId] && Date.now() - cooldowns[senderId] < cooldown) {
    let tiempo2 = segundosAHMS(Math.ceil((cooldowns[senderId] + cooldown - Date.now()) / 1000))
    return m.reply(`🕓 Ya cometiste un crimen hace poco.\n⏱️ Espera *${tiempo2}* antes de intentarlo de nuevo.`)
  }

  cooldowns[senderId] = Date.now()

  const rand = Math.random()
  const jailChance = 0.1
  const failChance = 0.3
  const successChance = 0.8

  if (rand < jailChance) {
    jail[senderId] = Date.now() + jailCooldown
    return m.reply(`🚓 ${pickRandom(frasesPolicia)}\n🔒 Estás detenido por 1 hora.`)
  }

  let victimId = Object.keys(users).filter(u => u !== senderId)[Math.floor(Math.random() * (Object.keys(users).length - 1))]
  let victimCoin = users[victimId].coin || 0

  const cantidad = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000

  if (rand < jailChance + successChance * 0.6) {

    let real = Math.min(cantidad, victimCoin)
    users[senderId].coin += real
    users[victimId].coin -= real
    conn.sendMessage(m.chat, {
      text: `✿ ${pickRandom(frasesExito)} *¥${real.toLocaleString()} ${moneda}*\n> ¡Bien hecho, ${senderName}! Ahora tienes *¥${users[senderId].coin.toLocaleString()}*.`,
      contextInfo: { mentionedJid: [victimId] }
    }, { quoted: m })
  } else if (rand < jailChance + successChance) {

    let real = Math.min(cantidad, victimCoin)
    users[senderId].coin += real
    users[victimId].coin -= real
    conn.sendMessage(m.chat, {
      text: `✿ ${pickRandom(frasesMixto)} *¥${real.toLocaleString()} ${moneda}*\n> No fue mucho, pero te sirve.\n> Tu saldo ahora es *¥${users[senderId].coin.toLocaleString()}*.`,
      contextInfo: { mentionedJid: [victimId] }
    }, { quoted: m })
  } else {
 
    let real = Math.min(cantidad, senderCoin)
    users[senderId].coin -= real
    m.reply(`🥀 ${pickRandom(frasesFracaso)} y perdiste *¥${real.toLocaleString()} ${moneda}*...\n> Tu saldo ahora es *¥${users[senderId].coin.toLocaleString()}*.`)
  }

  global.db.write()
}

handler.tags = ['economy']
handler.help = ['crimen']
handler.command = ['crimen', 'crime']
handler.register = true
handler.group = true

export default handler

function segundosAHMS(segundos) {
  let minutos = Math.floor(segundos / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const frasesExito = [
  'Hackeaste un cajero automático y obtuviste',
  'Robaste una joyería y ganaste',
  'Estafaste con NFTs falsos y cobraste',
  'Hackeaste OnlyFans y robaste',
  'Vendiste datos filtrados y conseguiste',
  'Estafaste a un político corrupto y obtuviste',
  'Robaste criptomonedas desde una laptop olvidada y ganaste',
  'Atracaste un banco disfrazado de payaso y obtuviste',
  'Clonaste una tarjeta de crédito y ganaste',
  'Hiciste phishing por correo y lograste'
]

const frasesFracaso = [
  'Tropezaste durante una huida y fuiste arrestado',
  'Te atraparon robando una tienda de donas',
  'Tu cómplice te traicionó y se llevó todo',
  'Fuiste grabado en TikTok en plena acción',
  'La cámara facial te reconoció al instante',
  'Intentaste vender humo y te desenmascararon',
  'Olvidaste apagar el GPS durante el robo',
  'Confundiste al cliente con un policía encubierto',
  'Usaste tu cuenta real para estafar y te congelaron',
  'Intentaste robar criptos pero era una trampa'
]

const frasesMixto = [
  'Robaste una cartera pero solo tenía',
  'Hackeaste una cuenta y lograste obtener',
  'Cometiste fraude menor y escapaste con',
  'Vendiste una taza con forma de Pikachu por',
  'Rompiste una ventana y hallaste solo',
  'Interceptaste una transferencia pero era mínima',
  'Robaste una mochila olvidada que solo tenía',
  'Clonaste una app falsa y te pagaron apenas',
]

const frasesPolicia = [
  '🚨 Te atraparon justo antes de huir',
  '👮 Una patrulla te vio en plena acción',
  '🧠 Te rastrearon por tus huellas digitales',
  '📷 Una cámara del semáforo te grabó robando',
  '🐕‍🦺 Un perro policía olfateó tus billetes marcados',
  '🔍 Un detective te investigaba desde hace días',
  '🧠 Usaste WiFi público y te localizaron',
  '👓 Un testigo te reconoció y te delató',
]
