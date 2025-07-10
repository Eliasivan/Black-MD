import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import fs from 'fs'

let tags = {
  'main': '𝙄𝙉𝙁𝙊-𝘽𝙊𝙏',
  'buscador': '𝘽𝙐𝙎𝘾𝘼𝘿𝙊𝙍𝙀𝙎',
  'fun': '𝙅𝙐𝙀𝙂𝙊𝙎',
  'jadibot': '𝙎𝙀𝙍𝘽𝙊𝙏',
  'rpg': '𝙍𝙋𝙂',
  'rg': '𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝙊',
  'xp': '𝙀𝙓𝙋',
  'sticker': '𝙎𝙏𝙄𝘾𝙆𝙀𝙍𝙎',
  'anime': '𝘼𝙉𝙄𝙈𝙀𝙎',
  'database': '𝘿𝘼𝙏𝘼𝘽𝘼𝙎𝙀',
  'fix': '𝙁𝙄𝙓𝙈𝙀𝙉𝙎𝘼𝙅𝙀𝙎',
  'grupo': '𝙂𝙍𝙐𝙋𝙊𝙎',
  'nable': '𝙊𝙉 / 𝙊𝙁𝙁', 
  'descargas': '𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙨',
  'youtube': '𝙔𝙊𝙐𝙏𝙐𝘽𝙀',
  'tools': '𝙃𝙀𝙍𝙍𝘼𝙈𝙄𝙀𝙉𝙏𝘼𝙎',
  'info': '𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊́𝙉',
  'nsfw': '𝙉𝙎𝙁𝙒', 
  'owner': '𝘾𝙍𝙀𝘼𝘿𝙊𝙍', 
  'mods': '𝙎𝙏𝘼𝙁𝙁',
  'audio': '𝘼𝙐𝘿𝙄𝙊𝙎', 
  'ai': '𝘼𝙄',
  'transformador': '𝘾𝙊𝙉𝙑𝙀𝙍𝙏𝙄𝘿𝙊𝙍𝙀𝙎',
}

const defaultMenu = {
  before: `Hola! Soy *${botname}* (｡•̀ᴗ-)✧
Aquí tienes la lista de comandos...
%readmore`.trimStart(),
  header: '╭⬪ %category ⬪╮',
  body: '├ %cmd',
  footer: '╰──────',
  after: `> ${dev}`
}

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    // test
    let userId = m.sender

    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, estrellas, level, role } = global.db.data.users[userId]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(userId)

    let d = new Date(new Date + 3600000)
    let locale = 'es'
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
    let time = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' })

    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered).length

    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
      prefix: 'customPrefix' in plugin,
      estrellas: plugin.estrellas,
      premium: plugin.premium,
      enabled: !plugin.disabled,
    }))

    for (let plugin of help) {
      if (plugin && 'tags' in plugin) {
        for (let tag of plugin.tags) {
          if (!(tag in tags) && tag) tags[tag] = tag
        }
      }
    }

    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == conn.user.jid ? '' : `Powered by https://wa.me/${conn.user.jid.split`@`[0]}`) + defaultMenu.after

    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%isdiamond/g, menu.diamond ? '(ⓓ)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')

    let replace = {
      '%': '%',
      p: _p,
      uptime, muptime,
      me: conn.getName(conn.user.jid),
      taguser: '@' + userId.split("@s.whatsapp.net")[0],
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
      botofc: (conn.user.jid == global.conn.user.jid ? '🚩 𝙴𝚂𝚃𝙴 𝙴𝚂 𝙴𝙻 𝙱𝙾𝚃 𝙾𝙵𝙲' : `🚩 𝚂𝚄𝙱-𝙱𝙾𝚃 𝙳𝙴: Wa.me/${global.conn.user.jid.split`@`[0]}`),
      greeting, level, estrellas, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }

    let text = _text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

    const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : userId
    const pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://telegra.ph/file/327f6ad853cb4f405aa80.jpg')

    const db = './media/database/db.json'
    const db_ = JSON.parse(fs.readFileSync(db))
    const category = "video"
    const random = Math.floor(Math.random() * db_.links[category].length)
    const rlink = db_.links[category][random]
    global.vid = rlink
    const response = await fetch(vid)
    const gif = await response.buffer()

    await m.react('🫧')
    await conn.sendMessage(
      m.chat,
      {
        video: { url: vid },
        caption: text.trim(),
        contextInfo: {
          mentionedJid: [userId],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363276986902836@newsletter',
            newsletterName: 'ᘜOKᑌ-ᗷᒪᗩᑕK-ᗷOT-ᗰᗪ',
            serverMessageId: -1,
          },
          forwardingScore: 999,
          externalAdReply: {
            title: '𝐆𝐨𝐤𝐮-𝐁𝐥𝐚𝐜𝐤-𝐁𝐨𝐭-𝐌𝐃',
            body: dev,
            thumbnailUrl: icono,
            sourceUrl: redes,
            mediaType: 1,
            renderLargerThumbnail: false,
          },
        },
        gifPlayback: true,
        gifAttribution: 0
      },
      { quoted: fkontak }
    )

  } catch (e) {
    conn.reply(m.chat, '🔵 Lo sentimos, el menú tiene un error', m)
    throw e
  }
}
handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'menuall', 'allmenú', 'allmenu', 'menucompleto']
handler.register = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = is