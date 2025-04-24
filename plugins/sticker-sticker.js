import { Sticker } from 'wa-sticker-formatter'
import sharp from 'sharp'

let handler = async (m, { conn }) => {
  if (!m.quoted || !/image/.test(m.quoted.mimetype)) return m.reply('`Responda a una imagen para convertirla en sticker.')
  
  let comando = m.text.split(' ')[0].toLowerCase()
  let opciones = m.text.split(' ')
  
  let buffer = await m.quoted.download()
  
  if (opciones.includes('-i')) {
    buffer = await sharp(buffer).resize(512, 512, { fit: 'fill' }).toFormat('png').toBuffer()
  } else if (opciones.includes('-c')) {
    buffer = await sharp(buffer).resize(512, 512, { fit: 'cover' }).toFormat('png').toBuffer()
    buffer = await circleImage(buffer)
  }
  
  let sticker = new Sticker(buffer, {
    pack: 'Ivan',
    author: 'Sticker creado con Ivan',
  })
  
  let stickerBuffer = await sticker.toBuffer()
  await conn.sendMessage(m.chat, { sticker: stickerBuffer })
}

async function circleImage(buffer) {
  let img = await sharp(buffer).toFormat('png').toBuffer()
  let { data, info } = await sharp(img).raw().toBuffer({ resolveWithObject: true })
  let ctx = createCanvas(info.width, info.height)
  let canvas = ctx.canvas
  ctx.drawImage(new ImageBuffer(data, info.width, info.height), 0, 0)
  ctx.save()
  ctx.beginPath()
  ctx.arc(info.width / 2, info.height / 2, Math.min(info.width, info.height) / 2, 0, 2 * Math.PI)
  ctx.clip()
  ctx.drawImage(new ImageBuffer(data, info.width, info.height), 0, 0)
  ctx.restore()
  return canvas.toBuffer()
}

class ImageBuffer {
  constructor(data, width, height) {
    this.data = data
    this.width = width
    this.height = height
  }
}

import { createCanvas } from 'canvas'

handler.help = ['.s']
handler.tags = ['sticker']
handler.command = ['s']

export default handler