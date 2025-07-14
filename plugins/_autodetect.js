import fetch from 'node-fetch'
import { WAMessageStubType } from '@whiskeysockets/baileys'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fkontak = {} 
const imagen1 = 'https://example.com/default.jpg'
const dev = 'Bot Developer'
const channel = 'https://t.me/yourchannel'

let handler = m => m

handler.before = async function (m, { conn, participants }) {
  if (!m.messageStubType || !m.isGroup) return

  let usuario = `@${m.sender.split`@`[0]}`
  const groupAdmins = participants.filter((p) => p.admin)
  const chat = global.db.data.chats[m.chat]

  let pp = await conn.profilePictureUrl(conn.user.jid).catch(_ => imagen1)
  const img = await (await fetch(pp)).buffer()

  if (chat.detect && m.messageStubType == WAMessageStubType["GROUP_SETTING_CHANGE"]) {
    await this.sendMessage(m.chat, {
      text: `🚩 *Ahora ${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'} pueden editar la información del grupo*`,
      mentions: [m.sender]
    }, { quoted: fkontak })
  
  } else if (chat.detect && m.messageStubType == WAMessageStubType["GROUP_REVOKE_INVITE"]) {
    await this.sendMessage(m.chat, {
      text: `🚩 *El grupo ha sido ${m.messageStubParameters[0] == 'on' ? 'cerrado' : 'abierto'}*\n\n${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'} pueden enviar mensajes`,
      mentions: [m.sender]
    }, { quoted: fkontak })

  } else if (chat.detect && m.messageStubType == WAMessageStubType["ADD_ADMIN"]) {
    let txt1 = `🚩 *Nuevo admin*\n\n`
    txt1 += `Nombre: @${m.messageStubParameters[0].split`@`[0]}\n`
    txt1 += `Le otorgó admin: @${m.sender.split`@`[0]}`

    await conn.sendMessage(m.chat, {
      text: txt1,
      mentions: [...txt1.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net'),
      contextInfo: {
        mentionedJid: [...txt1.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net'),
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          title: global.packname,
          body: dev,
          mediaType: 1,
          thumbnail: img,
          mediaUrl: channel,
          sourceUrl: channel
        }
      }
    })

  } else if (chat.detect && m.messageStubType == WAMessageStubType["REMOVE_ADMIN"]) {
    let txt2 = `🚩 *Un admin menos*\n\n`
    txt2 += `Nombre: @${m.messageStubParameters[0].split`@`[0]}\n`
    txt2 += `Le quitó admin: @${m.sender.split`@`[0]}`

    await conn.sendMessage(m.chat, {
      text: txt2,
      mentions: [...txt2.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net'),
      contextInfo: {
        mentionedJid: [...txt2.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net'),
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          title: global.packname,
          body: dev,
          mediaType: 1,
          thumbnail: img,
          mediaUrl: channel,
          sourceUrl: channel
        }
      }
    })
  } else {
    if (m.messageStubType == 2) return
    console.log({
      messageStubType: m.messageStubType,
      messageStubParameters: m.messageStubParameters,
      type: WAMessageStubType[m.messageStubType],
    })
  }
}

export default handler
