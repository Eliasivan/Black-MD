import { xpRange } from '../lib/levelling.js'
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
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
  'tools': '`𝙃𝙀𝙍𝙍𝘼𝙈𝙀𝙉𝙏𝘼𝙎`',
  'info': '`𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊́𝙉`',
  'nsfw': '`𝙉𝙎𝙁𝙒`', 
  'owner': '`𝘾𝙍𝙀𝘼𝘿𝙊𝙍`', 
  'mods': '`𝙎𝙏𝘼𝙁𝙁`',
  'audio': '`𝘼𝙐𝘿𝙄𝙊𝙎`', 
  'ai': '`𝘼𝙄`',
  'transformador': '`𝘾𝙊𝙉𝙑𝙀𝙍𝙏𝙄𝘿𝙊𝙍𝙀𝙎`',
}

const defaultMenu = {
  before: `*╭═━═━═━─ [ ＵＳＵＡＲＩＯＳ ] ─━═━═━═╮*
*〣*╭──────────────
*〣*├⫹⫺ *Nombre :* %name
*〣*├⫹⫺ %moneda : *%coin*
*〣*├⫹⫺ *Nivel :* %level
*〣*├⫹⫺ *Rango :* %role
*〣*├⫹⫺ *Exp :* %exp
*〣*╰──────────────
꒷︶꒷꒥꒷‧₊˚૮꒰˵•ᵜ•˵꒱ა‧₊˚꒷₊˚૮꒰˵•ᵜ•˵꒱ა‧₊˚꒷︶꒷꒥꒷

*╭═━═━═━─ [ ＩＮＦＯＢＯＴ ] ─━═━═━═╮*
*〣*╭──────────────
*〣├⫹⫺ *Numero:* wa.me/59169739411
*〣*├⫹⫺ *Tiempo Activo:* %uptime
*〣*├⫹⫺ *Registrado :* %rtotalreg de %totalreg usuarios
*〣*╰──────────────
꒷︶꒷꒥꒷‧₊˚૮꒰˵•ᵜ•˵꒱ა‧₊˚꒷₊˚૮꒰˵•ᵜ•˵꒱ა‧₊˚꒷︶꒷꒥꒷

*╭═━═━═━─「 ＨＯＹ 」─━═━═━═╮*
*〣* *Fecha :* %date
꒷︶꒷꒥꒷‧₊˚૮꒰˵•ᵜ•˵꒱ა‧₊˚꒷₊˚૮꒰˵•ᵜ•˵꒱

`.trimStart(),
  header: '*╭═━═━═━─「 %category 」─━═━═━═╮*',
  body: '*〣* ├⫹⫺  %cmd',
  footer: '꒷︶꒷꒥꒷‧₊˚૮꒰˵•ᵜ•˵꒱ა‧₊˚꒷₊˚૮꒰˵•ᵜ•˵꒱ა‧',
  after: `
`,
}

function clockString(ms) {
  if (isNaN(ms)) return '--:--:--'
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

const handler = async (m, { conn, usedPrefix: _p, command }) => {
  try {
    let userId = m.sender
    let userData = global.db.data.users[userId] || {}
    let { exp = 0, estrellas = 0, level = 0, role = '', coin = 0, moneda = 'Yenes' } = userData
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(userId)
    let uptime = clockString(process.uptime() * 1000)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered).length
    let fecha = new Date.plugins).filter(p => !p.disabled).map(plugin => ({
      help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
      prefix: 'customPrefix' in plugin,
      premium: plugin.premium,
      enabled.disabled,
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
      .replace(/%level/g, level)
      .replace(/%exp/g, exp - min)
      .replace(/%coin/g, coin)
      .replace(/%moneda/g, moneda)
      .replace(/%role/g, role)
      .replace(/%uptime/g, uptime)
      .replace(/%totalreg/g, totalreg)
      .replace(/%rtotalreg/g, rtotalreg)
      .replace(/%date/g, fecha)

   /* const messageContent = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({ text: text }),
            footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Goku-Black-Bot-MD by Rayo' }),
            header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: '✐ Canal oficial',
                    url: 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m',
                    merchant_url: 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'
                  })
                },
                {
                  buttonId: '.creador',
                  buttonText: { displayText: 'Creador' },
                  type: 1
                }
              ]
            })
          })
        }
      }
    }/*

    const msg = generateWAMessageFromContent(m.chat, messageContent, {
      userJid: m.sender,
      quoted: m
    })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    await conn.reply(m.chat, '🔵 Lo sentimos, el menú tiene un error', m)
    throw e
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'menuall', 'allmenú', 'allmenu', 'menucompleto']
handler.register = true

export