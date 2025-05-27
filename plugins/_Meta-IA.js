import fetch from 'node-fetch'

var handler = async (m, { text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `✨ *Ingresa una petición*\n\nEjemplo: ${usedPrefix + command} hola, ¿conoces a Goku-Black-Bot-MD?`, m)
  try {
    await m.react('🕒')
    conn.sendPresenceUpdate('composing', m.chat)
    var apii = await fetch(`https://api.dorratz.com/ai/gemini?prompt=${encodeURIComponent(text)}`)
    var res = await apii.json()
    if (res && res.response) {
      await conn.reply(m.chat, res.response, m)
      await m.react('✅️')
    } else {
      conn.reply(m.chat, '❌ La API no devolvió una respuesta válida.', m)
    }
  } catch (error) {
    console.error("❌ Error al obtener la respuesta de la API:", error.message)
    conn.reply(m.chat, '❌ Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.', m)
  }
}

handler.command = ['meta']
handler.help = ['metaia']
handler.tags = ['ai']
export default handler