/*
• @Eliasivan 
- https://github.com/Eliasivan 
*/
import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = {
  command: ['play'],
  func: async (m, { conn, text }) => {
    try {
      if (!text.trim()) {
        return conn.reply(m.chat, `❀ Por favor, ingresa el nombre de la música a descargar.`, m)
      }

      let videoIdToFind = text.match(youtubeRegexID) || null
      let yt_play = await yts(videoIdToFind === null ? text : 'https:                                

      if (videoIdToFind) {
        const videoId = videoIdToFind[1]
        yt_play = yt_play.all.find(item => item.videoId === videoId) || yt_play.videos.find(item => item.videoId === videoId)
      }

      yt_play = yt_play.all?.[0] || yt_play.videos?.[0] || yt_play

      if (!yt_play || yt_play.length == 0) {
        return m.reply('//youtu.be/' + videoIdToFind[1])

      if (videoIdToFind) {
        const videoId = videoIdToFind[1]
        yt_play = yt_play.all.find(item => item.videoId === videoId) || yt_play.videos.find(item => item.videoId === videoId)
      }

      yt_play = yt_play.all?.[0] || yt_play.videos?.[0] || yt_play

      if (!yt_play || yt_play.length == 0) {
        return m.reply('✧ No se encontraron resultados para tu búsqueda.')
      }

      const infoMessage = `*◉——⌈🔊 YOUTUBE-PLAY 🔊⌋——◉*\n ❏ 📌 *Titulo:* ${yt_play.title} ❏ 📆 *Publicado:* ${yt_play.ago} ❏ ⌚ *Duracion:* ${secondString(yt_play.duration.seconds)} ❏ 👀 *Vistas:* ${`${MilesNumber(yt_play.views)}`} ❏ 👤 *Autor:* ${yt_play.author.name} ❏ ⏯️ *Canal:* ${yt_play.author.url} ❏ 🆔 *ID:* ${yt_play.videoId} ❏ 🪬 *Tipo:* ${yt_play.type} ❏ 🔗 *Link:* ${yt_play.url}\n ❏ *_Enviando audio, aguarde un momento．．．_*`

      await conn.reply(m.chat, infoMessage, m)

      try {
        const api = await (await fetch(`https:                                                         
        const resulta = api.result
        const result = resulta.dl_url

        if (!result) throw new Error('//api.vreden.my.id/api/ytmp3?url=${yt_play.url}`)).json()
        const resulta = api.result
        const result = resulta.dl_url

        if (!result) throw new Error('⚠ El enlace de audio no se generó correctamente.')

        await conn.sendMessage(m.chat, {
          audio: { url: result },
          fileName: `${api.result.title}.mp3`,
          mimetype: 'audio/mpeg'
        }, { quoted: m })
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el audio. Esto puede deberse a que el archivo es demasiado pesado o a un error en la generación de la URL. Por favor, intenta nuevamente más tarde.', m)
      }
    } catch (error) {
      return m.reply(`⚠︎ Ocurrió un error: ${error}`)
    }
  }
}

function secondString(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, 'function secondString(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
}

function MilesNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export default handler