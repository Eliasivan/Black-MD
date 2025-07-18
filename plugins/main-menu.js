import { xpRange } from '../lib/levelling.js'
import fs from 'fs'

let tags = {
  'main': '`𝙄𝙉𝙁𝙊-𝘽𝙊𝙏`',
  'buscador': '`𝘽𝙐𝙎𝘾𝘼𝘿𝙊𝙍𝙀𝙎`',
  'fun': '`JUEGOS`',
  'jadibot': '`𝙎𝙀𝙍𝘽𝙊𝙏`',
  'rpg': '`𝙍𝙋𝙂`',
  'rg': '`𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝙊`',
  'xp': '`𝙀𝙓𝙋`',
  'sticker': '`𝙎𝙏𝙄𝘾𝙆𝙀𝙍𝙎`',
  'anime': '`𝘼𝙉𝙄𝙈𝙀𝙎`',
  'database': '`𝘿𝘼𝙏𝘼𝘽𝘼𝙎𝙀`',
  'fix': '`𝙁𝙄𝙓𝙈𝙀𝙉𝙎𝘼𝙅𝙀𝙎`',
  'grupo': '`𝙂𝙍𝙐𝙋𝙊𝙎`',
  'nable': '`𝙊𝙉 / 𝙊𝙁𝙁`', 
  'descargas': '`𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙨`',
  'youtube': '`𝙔𝙊𝙐𝙏𝙐𝘽𝙀`',
  'tools': '`𝙃𝙀𝙍𝙍𝘼𝙈𝙄𝙀𝙉𝙏𝘼𝙎`',
  'info': '`𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊́𝙉`',
  'nsfw': '`𝙉𝙎𝙁𝙒`', 
  'owner': '`𝘾𝙍𝙀𝘼𝘿𝙊𝙍`', 
  'mods': '`𝙎𝙏𝘼𝙁𝙁`',
  'audio': '`𝘼𝙐𝘿𝙄𝙊𝙎`', 
  'ai': '`𝘼𝙄`',
  'transformador': '`𝘾𝙊𝙉𝙑𝙀𝙍𝙏𝙄𝘿𝙊𝙍𝙀𝙎`',
}

const defaultMenu = {
  before: `Hola %name! Soy *${global.botname || 'Goku-Black-Bot-MD'}* ... (resumen del texto del menú)`,
  header: '╭✰ %category ✰╮',
  body: '├ %cmd',
  footer: '╰──────',
  after: `> ${global.dev || 'Rayo'}`
}

const greeting = '¡Bienvenido!'
const dev = global.dev || 'By Rayo'
const icono = global.icono || 'https://telegra.ph/file/327f6ad853cb4f405aa80.jpg'
const redes = global.redes || 'https://github.com/Eliasivan/Goku-Black-Bot-MD'

const fkontak = {
  key: { remoteJid: 'status@broadcast', fromMe: false, id: 'GokuBlackBot', participant: '0@s.whatsapp.net' },
  message: {
    contactMessage: {
      displayName: 'GokuBlackBot',
      vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:GokuBlackBot\nitem1.TEL;waid=1234567890:1234567890\nitem1.X-ABLabel:Mobile\nEND:VCARD'
    }
  }
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let userId = m.sender
    let userData = global.db.data.users[userId] || {}
    let { exp = 0, estrellas = 0, level = 0, role = '', coin = 0, moneda = 'Yenes' } = userData
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(userId)

    let uptime = clockString(process.uptime() * 1000)
    let totalreg = Object.keys(global.db.data.users).length

    let help = Object.values(global.plugins).filter(p => !p.disabled).map(plugin => ({
      help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
      prefix: 'customPrefix' in plugin,
      premium: plugin.premium,
      enabled: !plugin.disabled,
    }))

    for (let plugin of help) {
      for (let tag of plugin.tags) {
        if (!(tag in tags)) tags[tag] = tag
      }
    }

    let before = defaultMenu.before
    let header = defaultMenu.header
    let body = defaultMenu.body
    let footer = defaultMenu.footer
    let after = defaultMenu.after

    let _text = [
      before,
      ...Object.keys(tags).map(tag =>
        header.replace(/%category/g, tags[tag]) + '\n' +
        help.filter(menu => menu.tags.includes(tag)).map(menu =>
          menu.help.map(cmd =>
            body.replace(/%cmd/g, menu.prefix ? cmd : _p + cmd)
          ).join('\n')
        ).join('\n') +
        '\n' + footer
      ),
      after
    ].join('\n')

    let text = _text.replace(/%name/g, name)
      .replace(/%level/g, level).replace(/%exp/g, exp - min)
      .replace(/%coin/g, coin).replace(/%moneda/g, moneda)
      .replace(/%uptime/g, uptime).replace(/%totalreg/g, totalreg)

    await conn.sendMessage(
      m.chat,
      {
        image: { url: './src/menus/Menu.jpg' },
        caption: text.trim(),
        mentions: [userId]
      },
      { quoted: fkontak }
    )

  } catch (e) {
    await conn.reply(m.chat, '🔵 Lo sentimos, el menú tiene un error', m)
    throw e
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'menuall', 'allmenú', 'allmenu', 'menucompleto']
handler.register = true

export default handler

function clockString(ms) {
  if (isNaN(ms)) return '--:--:--'
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
