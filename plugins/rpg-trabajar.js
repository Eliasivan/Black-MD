let cooldowns = {}

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  let tiempo = 1 * 60 // 1 minuto

  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempo * 1000) {
    const tiempo2 = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempo * 1000 - Date.now()) / 1000))
    return conn.reply(m.chat, `🤠 Debes esperar *${tiempo2}* para usar *#chamba* de nuevo.`, m)
  }

  cooldowns[m.sender] = Date.now()

  const ganar = Math.random() < 0.85
  const monto = ganar
    ? Math.floor(Math.random() * (12000 - 1000 + 1)) + 1000
    : Math.floor(Math.random() * (6000 - 800 + 1)) + 800

  let mensaje = ''
  if (ganar) {
    user.coin += monto
    const trabajo = pickRandom(trabajosBuenos)
    mensaje = `✿ ${trabajo} *¥${monto.toLocaleString()} ${moneda}🌹*`
  } else {
    user.coin = Math.max(0, user.coin - monto)
    const trabajo = pickRandom(trabajosMalos)
    mensaje = `🥀 ${trabajo} *¥${monto.toLocaleString()} ${moneda}...*`
  }

  await conn.reply(m.chat, mensaje, m)
}

handler.help = ['chamba', 'trabajar', 'work', 'w']
handler.tags = ['economy']
handler.command = ['chamba', 'trabajar', 'w', 'work', 'chambear']
handler.group = true
handler.register = true

export default handler

function segundosAHMS(segundos) {
  let minutos = Math.floor((segundos % 3600) / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const trabajosBuenos = [
  "Vendiste helados en un día soleado y ganaste",
  "Limpiando ventanas de rascacielos recibiste propina de",
  "Programaste un bot para una empresa y te dieron",
  "Le hiciste una ilustración a una VTuber famosa y cobraste",
  "Fuiste doble de riesgo en una película y ganaste",
  "Hiciste delivery en bicicleta y te pagaron",
  "Ganaste un torneo de Genshin Impact y obtuviste",
  "Tu canal de YouTube se hizo viral y te pagaron",
  "Vendiste stickers en una convención anime y ganaste",
  "Condujiste un taxi todo el día y lograste",
  "Actuaste en un comercial de fideos y te pagaron",
  "Ganaste un concurso de cocina y recibiste",
  "Vendiste peluches de waifus y ganaste",
  "Ayudaste a reparar computadoras y cobraste",
  "Llevaste delivery en patineta y ganaste",
  "Hiciste dibujos por comisión y recibiste",
  "Cuidaste gatos en un café y te dieron",
  "Fuiste guía de un museo y recibiste",
  "Repartiste volantes todo el día y ganaste",
  "Condujiste Uber durante la lluvia y lograste",
  "Subiste un meme viral y te donaron",
  "Participaste como actor de doblaje en una serie indie y cobraste",
  "Vendiste ramen en la calle y tuviste éxito con",
  "Ganaste un reto de TikTok y recibiste",
  "Organizaste una rifa y te quedaste con",
  "Participaste en una banda de covers y ganaste",
  "Ayudaste a tu vecina a mudarse y te dio",
  "Fuiste extra en un dorama y cobraste",
  "Editaste un AMV que se hizo viral y te pagaron"
]

const trabajosMalos = [
  "Tropezaste y arruinaste todo el pedido, perdiste",
  "Tu jefe se fue sin pagarte, perdiste",
  "Compraste mercancía falsa y nadie te compró, perdiste",
  "Llegaste tarde y te descontaron",
  "Tuviste que pagar por romper una silla del evento",
  "Te estafaron con billetes falsos, perdiste",
  "Tuviste que pagar el delivery por adelantado y no te reembolsaron",
  "Te confundieron con otro repartidor y perdiste el pedido",
  "Una tormenta arruinó todo lo que vendías y perdiste",
  "Un cliente se enojó y no quiso pagarte",
  "Tu teléfono se mojó y tuviste que repararlo",
  "La policía te multó por vender en zona prohibida",
  "Se te cayó el café encima del cosplay de un cliente, perdiste",
  "Olvidaste el cambio y tuviste que cubrirlo tú",
  "Rompiste el monitor de un cliente y lo pagaste",
  "Te robaron tu bicicleta del delivery y perdiste dinero",
  "La computadora se quemó mientras trabajabas y tuviste que reponerla",
  "El cliente canceló a último minuto y perdiste inversión",
  "No entendiste el encargo y tuviste que devolver el dinero",
  "Te enfermaste en medio del trabajo y no pudiste terminar",
]
