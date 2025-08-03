import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'
const { proto } = (await import('@whiskeysockets/baileys')).default

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(r => setTimeout(() => r(), ms))

export async function handler(chatUpdate = {}) {
  this.msgqueque ??= []
  this.uptime ??= Date.now()

  const messages = chatUpdate.messages
  if (!messages || !Array.isArray(messages)) return
  await this.pushMessage(messages).catch(console.error)

  let m = messages[messages.length - 1]
  if (!m) return

  if (!global.db?.data) await global.loadDatabase()

  try {
    m = smsg(this, m) || m
    if (!m) return
    m.exp = m.exp || 0
    m.coin = false

    const u = global.db.data.users[m.sender] ?? {}
    global.db.data.users[m.sender] = {
      exp: isNumber(u.exp) ? u.exp : 0,
      coin: isNumber(u.coin) ? u.coin : 10,
      joincount: isNumber(u.joincount) ? u.joincount : 1,
      diamond: isNumber(u.diamond) ? u.diamond : 3,
      lastadventure: isNumber(u.lastadventure) ? u.lastadventure : 0,
      lastclaim: isNumber(u.lastclaim) ? u.lastclaim : 0,
      health: isNumber(u.health) ? u.health : 100,
      crime: isNumber(u.crime) ? u.crime : 0,
      lastcofre: isNumber(u.lastcofre) ? u.lastcofre : 0,
      lastdiamantes: isNumber(u.lastdiamantes) ? u.lastdiamantes : 0,
      lastcode: isNumber(u.lastcode) ? u.lastcode : 0,
      lastcodereg: isNumber(u.lastcodereg) ? u.lastcodereg : 0,
      lastduel: isNumber(u.lastduel) ? u.lastduel : 0,
      lastmining: isNumber(u.lastmining) ? u.lastmining : 0,
      muto: 'muto' in u ? u.muto : false,
      premium: 'premium' in u ? u.premium : false,
      premiumTime: isNumber(u.premiumTime) ? u.premiumTime : 0,
      registered: 'registered' in u ? u.registered : false,
      name: u.name ?? m.name,
      age: isNumber(u.age) ? u.age : -1,
      regTime: isNumber(u.regTime) ? u.regTime : -1,
      afk: isNumber(u.afk) ? u.afk : -1,
      afkReason: u.afkReason ?? '',
      role: u.role ?? 'Nuv',
      banned: u.banned ?? false,
      useDocument: u.useDocument ?? false,
      bank: isNumber(u.bank) ? u.bank : 0,
      level: isNumber(u.level) ? u.level : 0,
      description: u.description ?? '',
      genre: u.genre ?? '',
      birth: u.birth ?? '',
      marry: u.marry ?? '',
      packstickers: u.packstickers ?? null,
    }

    const c = global.db.data.chats[m.chat] ?? {}
    global.db.data.chats[m.chat] = {
      ...c,
      isBanned: 'isBanned' in c ? c.isBanned : false,
      sAutoresponder: c.sAutoresponder ?? '',
      welcome: 'welcome' in c ? c.welcome : true,
      autoresponder: 'autoresponder' in c ? c.autoresponder : false,
      autolevelup: 'autolevelup' in c ? c.autolevelup : false,
      autoAceptar: c.autoAceptar ?? false,
      autoRechazar: c.autoRechazar ?? false,
      autosticker: c.autosticker ?? false,
      detect: 'detect' in c ? c.detect : true,
      antiBot: c.antiBot ?? false,
      antiBot2: c.antiBot2 ?? false,
      modoadmin: c.modoadmin ?? false,
      antiLink: c.antiLink ?? true,
      reaction: c.reaction ?? false,
      nsfw: c.nsfw ?? false,
      antifake: c.antifake ?? false,
      delete: c.delete ?? false,
      expired: isNumber(c.expired) ? c.expired : 0,
      antiLag: c.antiLag ?? false,
      per: Array.isArray(c.per) ? c.per : []
    }

    const jid = this.user?.jid
    const s = global.db.data.settings?.[jid] ?? {}
    global.db.data.settings[jid] = {
      self: 'self' in s ? s.self : false,
      restrict: 'restrict' in s ? s.restrict : true,
      jadibotmd: 'jadibotmd' in s ? s.jadibotmd : true,
      antiPrivate: 'antiPrivate' in s ? s.antiPrivate : false,
      autoread: 'autoread' in s ? s.autoread : false,
      status: isNumber(s.status) ? s.status : 0
    }

  } catch (err) {
    console.error('Error en inicialización:', err)
  }

  const opts = this.opts ?? {}
  const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net'
  const isROwner = [...global.owner.map(([n]) => n)].map(v => v.replace(/\D/g, '') + detectwhat).includes(m.sender)
  const isOwner = isROwner || m.fromMe
  const isMods = isROwner || global.mods.map(v => v.replace(/\D/g, '') + detectwhat).includes(m.sender)
  const _user = global.db.data.users[m.sender]
  const isPrems = isROwner || global.prems.map(v => v.replace(/\D/g, '') + detectwhat).includes(m.sender) || _user.premium

  if (m.isBaileys) return
  if (opts.nyimak) return
  if (!isROwner && opts.self) return
  if (opts.swonly && m.chat !== 'status@broadcast') return
  if (typeof m.text !== 'string') m.text = ''

  if (opts.queque && m.text && !(isMods || isPrems)) {
    this.msgqueque.push(m.id || m.key.id)
    await delay(5000)
  }

  m.exp += Math.ceil(Math.random() * 10)
}

let usedPrefix

async function getLidFromJid(id, conn) {
if (id.endsWith('@lid')) return id
const res = await conn.onWhatsApp(id).catch(() => [])
return res[0]?.lid || id
}
const senderLid = await getLidFromJid(m.sender, conn)
const botLid = await getLidFromJid(conn.user.jid, conn)
const senderJid = m.sender
const botJid = conn.user.jid
const groupMetadata = m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}
const participants = m.isGroup ? (groupMetadata.participants || []) : []
const user = participants.find(p => p.id === senderLid || p.id === senderJid) || {}
const bot = participants.find(p => p.id === botLid || p.id === botJid) || {}
const isRAdmin = user?.admin === "superadmin"
const isAdmin = isRAdmin || user?.admin === "admin"
const isBotAdmin = !!bot?.admin

const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
for (let name in global.plugins) {
let plugin = global.plugins[name]
if (!plugin)
continue
if (plugin.disabled)
continue
const __filename = join(___dirname, name)
if (typeof plugin.all === 'function') {
try {
await plugin.all.call(this, m, {
chatUpdate,
__dirname: ___dirname,
__filename
})
} catch (e) {
console.error(e)
}}
if (!opts['restrict'])
if (plugin.tags && plugin.tags.includes('admin')) {
continue
}
const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
let match = (_prefix instanceof RegExp ? 
[[_prefix.exec(m.text), _prefix]] :
Array.isArray(_prefix) ?
_prefix.map(p => {
let re = p instanceof RegExp ?
p :
new RegExp(str2Regex(p))
return [re.exec(m.text), re]
}) :
typeof _prefix === 'string' ?
[[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
[[[], new RegExp]]
).find(p => p[1])
if (typeof plugin.before === 'function') {
if (await plugin.before.call(this, m, {
match,
conn: this,
participants,
groupMetadata,
user,
bot,
isROwner,
isOwner,
isRAdmin,
isAdmin,
isBotAdmin,
isPrems,
chatUpdate,
__dirname: ___dirname,
__filename
}))
continue
}
if (typeof plugin !== 'function')
continue
if ((usedPrefix = (match[0] || '')[0])) {
let noPrefix = m.text.replace(usedPrefix, '')
let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
args = args || []
let _args = noPrefix.trim().split` `.slice(1)
let text = _args.join` `
command = (command || '').toLowerCase()
let fail = plugin.fail || global.dfail
let isAccept = plugin.command instanceof RegExp ? 
plugin.command.test(command) :
Array.isArray(plugin.command) ?
plugin.command.some(cmd => cmd instanceof RegExp ? 
cmd.test(command) :
cmd === command) :
typeof plugin.command === 'string' ? 
plugin.command === command :
false

global.comando = command

if ((m.id.startsWith('NJX-') || (m.id.startsWith('BAE5') && m.id.length === 16) || (m.id.startsWith('B24E') && m.id.length === 20))) return

if (!isAccept) {
continue
}
m.plugin = name
if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
if (!['grupo-unbanchat.js'].includes(name) && chat && chat.isBanned && !isROwner) return
if (name != 'grupo-unbanchat.js' && name != 'owner-exec.js' && name != 'owner-exec2.js' && name != 'grupo-delete.js' && chat?.isBanned && !isROwner) return
if (m.text && user.banned && !isROwner) {
m.reply(`《✦》Estas baneado/a, no puedes usar comandos en este bot!\n\n${user.bannedReason ? `✰ *Motivo:* ${user.bannedReason}` : '✰ *Motivo:* Sin Especificar'}\n\n> ✧ Si este Bot es cuenta oficial y tiene evidencia que respalde que este mensaje es un error, puedes exponer tu caso con un moderador.`)
return
}

if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
let setting = global.db.data.settings[this.user.jid]
if (name != 'grupo-unbanchat.js' && chat?.isBanned)
return 
if (name != 'owner-unbanuser.js' && user?.banned)
return
}}

let hl = _prefix 
let adminMode = global.db.data.chats[m.chat].modoadmin
let mini = `${plugins.botAdmin || plugins.admin || plugins.group || plugins || noPrefix || hl ||  m.text.slice(0, 1) == hl || plugins.command}`
if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && mini) return   
if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { 
fail('owner', m, this)
continue
}
if (plugin.rowner && !isROwner) { 
fail('rowner', m, this)
continue
}
if (plugin.owner && !isOwner) { 
fail('owner', m, this)
continue
}
if (plugin.mods && !isMods) { 
fail('mods', m, this)
continue
}
if (plugin.premium && !isPrems) { 
fail('premium', m, this)
continue
}
if (plugin.group && !m.isGroup) { 
fail('group', m, this)
continue
} else if (plugin.botAdmin && !isBotAdmin) { 
fail('botAdmin', m, this)
continue
} else if (plugin.admin && !isAdmin) { 
fail('admin', m, this)
continue
}
if (plugin.private && m.isGroup) {
fail('private', m, this)
continue
}
if (plugin.register == true && _user.registered == false) { 
fail('unreg', m, this)
continue
}
m.isCommand = true
let xp = 'exp' in plugin ? parseInt(plugin.exp) : 10
m.exp += xp
if (!isPrems && plugin.coin && global.db.data.users[m.sender].coin < plugin.coin * 1) {
conn.reply(m.chat, `❮✦❯ Se agotaron tus ${moneda}`, m)
continue
}
if (plugin.level > _user.level) {
conn.reply(m.chat, `❮✦❯ Se requiere el nivel: *${plugin.level}*\n\n• Tu nivel actual es: *${_user.level}*\n\n• Usa este comando para subir de nivel:\n*${usedPrefix}levelup*`, m)
continue
}
let extra = {
match,
usedPrefix,
noPrefix,
_args,
args,
command,
text,
conn: this,
participants,
groupMetadata,
user,
bot,
isROwner,
isOwner,
isRAdmin,
isAdmin,
isBotAdmin,
isPrems,
chatUpdate,
__dirname: ___dirname,
__filename
}
try {
await plugin.call(this, m, extra)
if (!isPrems)
m.coin = m.coin || plugin.coin || false
} catch (e) {
m.error = e
console.error(e)
if (e) {
let text = format(e)
for (let key of Object.values(global.APIKeys))
text = text.replace(new RegExp(key, 'g'), 'Administrador')
m.reply(text)
}
} finally {
if (typeof plugin.after === 'function') {
try {
await plugin.after.call(this, m, extra)
} catch (e) {
console.error(e)
}}
if (m.coin)
conn.reply(m.chat, `❮✦❯ Utilizaste ${+m.coin} ${moneda}`, m)
}
break
}}
} catch (e) {
console.error(e)
} finally {
if (opts['queque'] && m.text) {
const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
if (quequeIndex !== -1)
this.msgqueque.splice(quequeIndex, 1)
}
let user, stats = global.db.data.stats
if (m) { let utente = global.db.data.users[m.sender]
if (utente.muto == true) {
let bang = m.key.id
let cancellazzione = m.key.participant
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: cancellazzione }})
}
if (m.sender && (user = global.db.data.users[m.sender])) {
user.exp += m.exp
user.coin -= m.coin * 1
}

let stat
if (m.plugin) {
let now = +new Date
if (m.plugin in stats) {
stat = stats[m.plugin]
if (!isNumber(stat.total))
stat.total = 1
if (!isNumber(stat.success))
stat.success = m.error != null ? 0 : 1
if (!isNumber(stat.last))
stat.last = now
if (!isNumber(stat.lastSuccess))
stat.lastSuccess = m.error != null ? 0 : now
} else
stat = stats[m.plugin] = {
total: 1,
success: m.error != null ? 0 : 1,
last: now,
lastSuccess: m.error != null ? 0 : now
}
stat.total += 1
stat.last = now
if (m.error == null) {
stat.success += 1
stat.lastSuccess = now
}}}

try {
if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
} catch (e) { 
console.log(m, m.quoted, e)}
let settingsREAD = global.db.data.settings[this.user.jid] || {}  
if (opts['autoread']) await this.readMessages([m.key])

if (db.data.chats[m.chat].reaction && m.text.match(/(ción|dad|aje|oso|izar|mente|pero|tion|age|ous|ate|and|but|ify|ai|yuki|a|s)/gi)) {
let emot = pickRandom(["🍟", "😃", "😄", "😁", "😆", "🍓", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "🌺", "🌸", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🌟", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "💫", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😶‍🌫️", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🤖", "🍭", "🤫", "🫠", "🤥", "😶", "📇", "😐", "💧", "😑", "🫨", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😮‍💨", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👺", "🧿", "🌩", "👻", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🫶", "👍", "✌️", "🙏", "🫵", "🤏", "🤌", "☝️", "🖕", "🙏", "🫵", "🫂", "🐱", "🤹‍♀️", "🤹‍♂️", "🗿", "✨", "⚡", "🔥", "🌈", "🩷", "❤️", "🧡", "💛", "💚", "🩵", "💙", "💜", "🖤", "🩶", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🚩", "👊", "⚡️", "💋", "🫰", "💅", "👑", "🐣", "🐤", "🐈"])
if (!m.fromMe) return this.sendMessage(m.chat, { react: { text: emot, key: m.key }})
}
function pickRandom(list) { return list[Math.floor(Math.random() * list.length)]}
}}

global.dfail = (type, m, usedPrefix, command, conn) => {

let edadaleatoria = ['10', '28', '20', '40', '18', '21', '15', '11', '9', '17', '25'].getRandom()
let user2 = m.pushName || 'Anónimo'
let verifyaleatorio = ['registrar', 'reg', 'verificar', 'verify', 'register'].getRandom()

const msg = {
rowner: `『✦』El comando *${comando}* solo puede ser usado por los creadores del bot.`, 
owner: `『✦』El comando *${comando}* solo puede ser usado por los desarrolladores del bot.`, 
mods: `『✦』El comando *${comando}* solo puede ser usado por los moderadores del bot.`, 
premium: `『✦』El comando *${comando}* solo puede ser usado por los usuarios premium.`, 
group: `『✦』El comando *${comando}* solo puede ser usado en grupos.`,
private: `『✦』El comando *${comando}* solo puede ser usado al chat privado del bot.`,
admin: `『✦』El comando *${comando}* solo puede ser usado por los administradores del grupo.`, 
botAdmin: `『✦』Para ejecutar el comando *${comando}* debo ser administrador del grupo.`,
unreg: `『✦』El comando *${comando}* solo puede ser usado por los usuarios registrado, registrate usando:\n> » #${verifyaleatorio} ${user2}.${edadaleatoria}`,
restrict: `『✦』Esta caracteristica está desactivada.`
}[type];
if (msg) return m.reply(msg).then(_ => m.react('✖️'))}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
unwatchFile(file)
console.log(chalk.magenta("Se actualizo 'handler.js'"))

if (global.conns && global.conns.length > 0 ) {
const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]
for (const userr of users) {
userr.subreloadHandler(false)
}}})