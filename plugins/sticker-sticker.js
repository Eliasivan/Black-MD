import { Sticker } from 'wa-sticker-formatter'

let handler = async (m, { conn }) => {
  if (!m.quoted || !/image|video/.test(m.quoted.mimetype)) return m.reply('🚩 Menciona una imagen o video para convertirla en sticker.')
  
  let comando = m.text.split(' ')[0].toLowerCase()
  let opciones = m.text.split(' ')
  
  let buffer = await m.quoted.download()
  let sticker = new Sticker(buffer, {
    pack: 'Tylarz',
    author: 'Sticker creado con Tylarz',
  })
  
  if (opciones.includes('-i')) {
    sticker.setImage(buffer)
  } else if (opciones.includes('-x')) {
    sticker.crop = false
  } else if (opciones.includes('-c')) {
    sticker.circle = true
  }
  
  await sticker.build()
  let stickerBuffer = await sticker.getBuffer()
  await conn.sendMessage(m.chat, { sticker: stickerBuffer })
}

handler.help = ['.s']
handler.tags = ['sticker']
handler.command = /^(\.s)$/i

export default handler