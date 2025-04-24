import { Sticker } from 'wa-sticker-formatter'
import sharp from 'sharp'

let handler = async (m, { conn }) => {
  if (!m.quoted || !/image/.test(m.quoted.mimetype)) return m.reply('🚩 Responda a una imagen para convertirla en sticker.')
  
  let comando = m.text.split(' ')[0].toLowerCase()
  let opciones = m.text.split(' ')
  
  let buffer = await m.quoted.download()
  
  if (opciones.includes('-i')) {
    // Sticker ampliado
    buffer = await sharp(buffer).resize(512, 512, { fit: 'fill' }).toBuffer()
  } else if (opciones.includes('-c')) {
    // Sticker circular
    buffer = await sharp(buffer).resize(512, 512, { fit: 'cover' }).extract({ left: 128, top: 128, width: 256, height: 256 }).toFormat('png').toBuffer()
    const { createCanvas, loadImage } = require('canvas')
    const canvas = createCanvas(512, 512)
    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.arc(256, 256, 256, 0, 2 * Math.PI)
    ctx.clip()
    const img = await loadImage(buffer)
    ctx.drawImage(img, 0, 0, 512, 512)
    buffer = canvas.toBuffer()
  }
  
  let sticker = new Sticker(buffer, {
    pack: 'Tylarz',
    author: 'Sticker creado con Tylarz',
  })
  
  let stickerBuffer = await sticker.toBuffer()
  await conn.sendMessage(m.chat, { sticker: stickerBuffer })
}

handler.help = ['.s']
handler.tags = ['sticker']
handler.command = ['s']

export default handler