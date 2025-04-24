import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const username = `${conn.getName(m.sender)}`
  const basePrompt = `Tu nombre es Goku-Black-Bot-MD-Lite y parece haber sido creado por Ivan. Tu versión actual es 2.0.1, Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertida, y te encanta aprender. Lo más importante es que debes ser amigable con la persona con la que estás hablando. ${username}`

  if (!text) {
    return conn.reply(m.chat, `🍟 *Ingrese su petición*\n🚩 *Ejemplo de uso:* ${usedPrefix + command} Como hacer un avión de papel`, m)
  }

  await m.react('💬')

  try {
    const query = text
    const prompt = `${basePrompt}. Responde lo siguiente: ${query}`
    const response = await axios.get(`https://api.siputzx.my.id/api/ai/meta-llama-33-70B-instruct-turbo?content=${encodeURIComponent(prompt)}`)
    await conn.reply(m.chat, response.data, m)
  } catch (error) {
    console.error('🚩 Error al obtener la respuesta:', error)
    await conn.reply(m.chat, 'Error: intenta más tarde.', m)
  }
}

handler.help = ['chatgpt <texto>', 'ia <texto>']
handler.tags = ['ai']
handler.command = ['metai', 'chatgpt']
export default handler