import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'

import { sticker } from 'wa-sticker-formatter'

let handler = async (m, { conn }) => {
  if (!m.quoted || !/image|video|sticker/.test(m.quoted.mimetype)) return m.reply('🚩 Menciona una imagen, video o GIF para convertirla en sticker.')
  
  let type = m.text.split(' ')[0].toLowerCase()
  let options = {
    pack: 'Tylarz',
    author: 'Sticker creado con Tylarz',
  }
  
  if (type === '.s') {
    let buffer = await m.quoted.download()
    let sticker = new Sticker(buffer, options)
    await sticker.build()
    await conn.sendMessage(m.chat, { sticker: await sticker.getBuffer() })
  } else if (type === '.s' && m.text.includes('-i')) {
    // Sticker ampliado
    let buffer = await m.quoted.download()
    let sticker = new Sticker(buffer, { ...options, isImage: true })
    await sticker.build()
    await conn.sendMessage(m.chat, { sticker: await sticker.getBuffer() })
  } else if (type === '.s' && m.text.includes('-x')) {
    // Sticker acoplado
    let buffer = await m.quoted.download()
    let sticker = new Sticker(buffer, { ...options, crop: false })
    await sticker.build()
    await conn.sendMessage(m.chat, { sticker: await sticker.getBuffer() })
  } else if (type === '.s' && m.text.includes('-c')) {
    // Sticker circular
    let buffer = await m.quoted.download()
    let sticker = new Sticker(buffer, { ...options, circle: true })
    await sticker.build()
    await conn.sendMessage(m.chat, { sticker: await sticker.getBuffer() })
  } else {
    m.reply(`🚩 Opción inválida. Las opciones disponibles son:
.s (sticker normal)
.s -i (sticker ampliado)
.s -x (sticker acoplado)
.s -c (sticker circular)`)
  }
}

handler.help = ['.s', '.s -i', '.s -x', '.s -c']
handler.tags = ['sticker']
handler.command = /^(\.s)$/i

export default handler