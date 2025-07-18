let cooldowns = {}

let handler = async (m, { conn }) => {
  const users = global.db.data.users
  const senderId = m.sender
  const senderName = conn.getName(senderId)

  const cooldown = 5 * 60 * 1000 // 5 minutos
  if (cooldowns[senderId] && Date.now() - cooldowns[senderId] < cooldown) {
    const restante = segundosAHMS(Math.ceil((cooldowns[senderId] + cooldown - Date.now()) / 1000))
    return m.reply(`💦 Debes esperar *${restante}* para volver a usar *#slut*.`)
  }

  cooldowns[senderId] = Date.now()

  const senderCoin = users[senderId].coin || 0
  let targetId = Object.keys(users).filter(u => u !== senderId)[Math.floor(Math.random() * (Object.keys(users).length - 1))]
  let targetCoin = users[targetId].coin || 0

  const ganar = Math.random() < 0.8 // 60% de ganar
  const monto = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000

  const frasesGanancia = [
    '✿ Te vistieron de maid en público y te dieron *¥{monto}* por ser su juguete.',
    '✿ Participaste en una orgía oculta y recibiste *¥{monto}* por tus "servicios".',
    '✿ Le hiciste un show a @usuario y te lanzó *¥{monto}* encima.',
    '✿ Fuiste grabado en secreto en una película H y te pagaron *¥{monto}*.',
    '✿ Bailaste en una despedida de soltero y te dieron *¥{monto}*.',
    '✿ Fuiste tendencia en TikTok y recibiste *¥{monto}* en propinas.',
    '✿ Te contrataron para una parodia erótica y ganaste *¥{monto}*.',
    '✿ Te convertiste en VTuber NSFW por un día y te pagaron *¥{monto}*.',
    '✿ Te hiciste viral en una app adulta y recibiste *¥{monto}*.',
    '✿ Fuiste modelo para una revista picante y te dieron *¥{monto}*.',
    '✿ Vendiste tu ropa interior online y te pagaron *¥{monto}*.',
    '✿ Cobraron por acariciarte las orejitas neko y ganaste *¥{monto}*.',
    '✿ Fuiste anfitrión en un club nocturno y ganaste *¥{monto}*.',
    '✿ @usuario te dio una "propina secreta" de *¥{monto}* por tu actitud sumisa.',
    '✿ Jugaste a ser mascota en público y recibiste *¥{monto}* de premio.'
  ]

  const frasesPerdida = [
    '✿ Te arrestaron por indecencia pública. Multa: *¥{monto}*.',
    '✿ Nadie quiso tus servicios hoy. Gastaste *¥{monto}* en trajes.',
    '✿ Tu cliente se fue sin pagar. Perdiste *¥{monto}*.',
    '✿ Te fracturaste haciendo una pose. Gastaste *¥{monto}* en la clínica.',
    '✿ Tu show fue aburrido. Te lanzaron tomates y perdiste *¥{monto}*.',
    '✿ Llovió en plena calle y tu outfit se arruinó. Perdiste *¥{monto}*.',
    '✿ Te emborrachaste y pagaste la cuenta. *¥{monto}* menos.',
    '✿ Te drogaron y despertaste sin cartera. Te robaron *¥{monto}*.',
    '✿ Te confundieron con un trabajador ilegal. Pagaste *¥{monto}* de soborno.',
    '✿ Te manosearon sin pagar. Tu pérdida: *¥{monto}*.',
    '✿ Tu app NSFW se cayó y perdiste donaciones: *¥{monto}*.',
    '✿ Te equivocaste de cliente. Tuvo consecuencias: *¥{monto}* menos.',
    '✿ Te vetaron de tu plataforma de contenido. Reembolso: *¥{monto}*.',
    '✿ Invertiste en cosplay sexy y nadie compró: *¥{monto}* perdido.',
    '✿ Tu wig se voló en plena grabación. Arreglo costó *¥{monto}*.'
  ]

  const texto = pickRandom(ganar ? frasesGanancia : frasesPerdida)
    .replace('{monto}', monto.toLocaleString())
    .replace('@usuario', `@${targetId.split('@')[0]}`)

  if (ganar) {
    users[senderId].coin += monto
    users[targetId].coin -= Math.min(monto, targetCoin)
    conn.sendMessage(m.chat, {
      text: texto + `\n> 💸 Ahora tienes *¥${users[senderId].coin.toLocaleString()}*.`,
      contextInfo: { mentionedJid: [targetId] }
    }, { quoted: m })
  } else {
    users[senderId].coin = Math.max(0, senderCoin - monto)
    conn.reply(m.chat, texto + `\n> 💔 Tu saldo ahora es *¥${users[senderId].coin.toLocaleString()}*.`, m)
  }

  global.db.write()
}

handler.tags = ['rpg']
handler.help = ['slut']
handler.command = ['slut', 'protituirse']
handler.register = true
handler.group = true

export default handler

function segundosAHMS(segundos) {
  const minutos = Math.floor((segundos % 3600) / 60)
  const segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
