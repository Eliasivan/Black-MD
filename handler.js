import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'

const { proto } = (await import('@whiskeysockets/baileys')).default

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

const defaultUser = {
  exp: 0,
  coin: 10,
  joincount: 1,
  diamond: 3,
  lastadventure: 0,
  health: 100,
  lastclaim: 0,
  lastcofre: 0,
  lastdiamantes: 0,
  lastcode: 0,
  lastduel: 0,
  lastpago: 0,
  lastmining: 0,
  lastcodereg: 0,
  muto: false,
  registered: false,
  genre: '',
  birth: '',
  marry: '',
  description: '',
  packstickers: null,
  name: '',
  age: -1,
  regTime: -1,
  afk: -1,
  afkReason: '',
  banned: false,
  useDocument: false,
  bank: 0,
  level: 0,
  role: 'Nuv',
  premium: false,
  premiumTime: 0
}

const defaultChat = {
  isBanned: false,
  sAutoresponder: '',
  welcome: true,
  autolevelup: false,
  autoAceptar: false,
  autosticker: false,
  autoRechazar: false,
  autoresponder: false,
  detect: true,
  antiBot: false,
  antiBot2: false,
  modoadmin: false,
  antiLink: true,
  reaction: false,
  nsfw: false,
  antifake: false,
  delete: false,
  expired: 0,
  antiLag: false,
  per: []
}

const defaultSettings = {
  self: false,
  restrict: true,
  jadibotmd: true,
  antiPrivate: false,
  autoread: false,
  status: 0
}

export async function handler(chatUpdate) {
  try {
    this.msgqueque = this.msgqueque || []
    this.uptime = this.uptime || Date.now()

    if (!chatUpdate || !chatUpdate.messages || !Array.isArray(chatUpdate.messages)) {
      return
    }

    await this.pushMessage(chatUpdate.messages).catch(console.error)
    
    const m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m) return

    if (!global.db.data) await global.loadDatabase()

    const processedMsg = smsg(this, m) || m
    if (!processedMsg) return

    processedMsg.exp = 0
    processedMsg.coin = false

    const user = global.db.data.users[m.sender] || {...defaultUser, name: m.name}
    global.db.data.users[m.sender] = {...defaultUser, ...user}

    const chat = global.db.data.chats[m.chat] || {...defaultChat}
    global.db.data.chats[m.chat] = {...defaultChat, ...chat}

    const jid = this.user.jid
    const settings = global.db.data.settings[jid] || {...defaultSettings}
    global.db.data.settings[jid] = {...defaultSettings, ...settings}

    const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net'
    const isROwner = [...(global.owner || [])].map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)
    const isOwner = isROwner || m.fromMe
    const isMods = isROwner || [...(global.mods || [])].map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)
    const _user = global.db.data.users[m.sender] || {}
    const isPrems = isROwner || [...(global.prems || [])].map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender) || _user.premium

    if (m.isBaileys) return
    
    processedMsg.exp += Math.ceil(Math.random() * 10)

    const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
    
    for (const [name, plugin] of Object.entries(global.plugins || {})) {
      if (!plugin || plugin.disabled) continue
      
      const __filename = join(___dirname, name)
      
      try {
        if (typeof plugin.all === 'function') {
          await plugin.all.call(this, m, {
            chatUpdate,
            __dirname: ___dirname,
            __filename
          })
        }

        const prefix = plugin.customPrefix || this.prefix || global.prefix
        const prefixRegex = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
        const match = prefixRegex.exec(m.text)
        
        if (match) {
          const [usedPrefix] = match
          const noPrefix = m.text.replace(usedPrefix, '')
          const [command, ...args] = noPrefix.trim().split(/\s+/).filter(Boolean)
          const text = args.join(' ')
          const cmd = command.toLowerCase()

          if (plugin.command && (
            (plugin.command instanceof RegExp && plugin.command.test(cmd)) ||
            (Array.isArray(plugin.command) && plugin.command.includes(cmd)) ||
            (typeof plugin.command === 'string' && plugin.command === cmd)
          )) {
            const extra = {
              match,
              usedPrefix,
              noPrefix,
              args,
              command: cmd,
              text,
              conn: this,
              participants: [],
              groupMetadata: {},
              user: {},
              bot: {},
              isROwner,
              isOwner,
              isRAdmin: false,
              isAdmin: false,
              isBotAdmin: false,
              isPrems,
              chatUpdate,
              __dirname: ___dirname,
              __filename
            }

            await plugin.call(this, processedMsg, extra)
          }
        }
      } catch (e) {
        console.error(`Error en plugin ${name}:`, e)
      }
    }
  } catch (e) {
    console.error('Error en handler:', e)
  }
}

global.dfail = (type, m, usedPrefix, command, conn) => {
  const messages = {
    rowner: 'Solo para dueños del bot',
    owner: 'Solo para administradores del bot',
    mods: 'Solo para moderadores',
    premium: 'Solo para usuarios premium',
    group: 'Solo funciona en grupos',
    private: 'Solo funciona en privado',
    admin: 'Solo para admins del grupo',
    botAdmin: 'El bot debe ser admin',
    unreg: 'Regístrate primero',
    restrict: 'Función restringida'
  }
  
  m.reply(messages[type] || 'Error desconocido').catch(console.error)
}

const file = global.__filename(import.meta.url, true)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.magenta("Handler actualizado"))
  if (global.conns) {
    global.conns.forEach(conn => {
      if (conn.user && conn.ws.socket?.readyState !== 3) {
        conn.subreloadHandler(false)
      }
    })
  }
})
