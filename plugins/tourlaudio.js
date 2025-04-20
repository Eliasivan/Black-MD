import uploadFile from '../lib/uploadFile.js'
import uploadAudio from '../lib/uploadAudio.js' // Asegúrate de tener esta función en tu proyecto
import fetch from 'node-fetch'

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) return conn.reply(m.chat, '> Responde a un *Audio.*', m, rcanal)
  await m.react(rwait)
  try {
    let media = await q.download()
    let isAudio = /audio\/(mp3|wav|ogg)/.test(mime)
    if (!isAudio) return conn.reply(m.chat, '> Solo se admiten archivos de audio', m, rcanal)
    let link = await uploadAudio(media)
    let txt = ` *L I N K - E N L A C E* \n\n`
    txt += `*» Enlace* : ${link}\n`
    txt += `*» Acortado* : ${await shortUrl(link)}\n`
    txt += `*» Tamaño* : ${formatBytes(media.length)}\n`
    txt += `*» Expiración* : Desconocido\n\n`
    txt += `> *${dev}*`
    await conn.reply(m.chat, txt, m, rcanal)
    await m.react(done)
  } catch {
    await conn.reply(m.chat, '🌹 Ocurrió un error', m, fake)
    await m.react(error)
  }
}

handler.help = ['tourlaudio']
handler.tags = ['transformador']
handler.command = ['tourlaudio', 'uploadaudio']
handler.premium = false

export default handler

function formatBytes(bytes) {
  if (bytes === 0) {
    return '0 B';
  }
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function shortUrl(url) {
  let res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`)
  return await res.text()
}