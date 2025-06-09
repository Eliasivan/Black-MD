let linkRegex = /(https?:\/\/(?:www\.)?(?:t\.me|telegram\.me|whatsapp\.com)\/\S+)|(https?:\/\/chat\.whatsapp\.com\/\S+)|(https?:\/\/whatsapp\.com\/channel\/\S+)/i

export async function before(m, { isAdmin, isBotAdmin }) {
if (m.isBaileys && m.fromMe)
return !0
if (!m.isGroup) return !1
let chat = global.db.data.chats[m.chat]
let delet = m.key.participant
let bang = m.key.id
let bot = global.db.data.settings[this.user.jid] || {}
const isGroupLink = linkRegex.exec(m.text)
const grupo = `https://chat.whatsapp.com`
if (isAdmin && chat.antiLink && m.text.includes(grupo)) return conn.reply(m.chat, `୧⌓̈⃝୨ αղԵílíղk αcԵí́ѵօ, ҽɾҽs αժოíղ Եҽ sαlѵαsԵҽ`, m, )
if (chat.antiLink && isGroupLink && !isAdmin) {
if (isBotAdmin) {
const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
if (m.text.includes(linkThisGroup)) return !0
}
await conn.reply(m.chat, `📎 *¡ᥱᥒᥣᥲᥴᥱ ძᥱ𝗍ᥱᥴ𝗍ᥲძ᥆!*\n\n*${await this.getName(m.sender)} mᥲᥒძᥲs𝗍ᥱ ᥙᥒ ᥱᥒᥣᥲᥴᥱ ⍴r᥆һіᑲіძ᥆ ⍴᥆r ᥣ᥆ ᥴᥙᥲᥣ sᥱrᥲs ᥱᥣіmіᥒᥲძ᥆ ☠︎*`, m, )
if (!isBotAdmin) return conn.reply(m.chat, `*ᥒ᥆ s᥆ᥡ ᥲძmіᥒ, ᥒ᥆ ⍴ᥙᥱძ᥆ ᥱᥣіmіᥒᥲr іᥒ𝗍rᥙs᥆s ლ*`, m, )
if (isBotAdmin) {
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
} else if (!bot.restrict) return conn.reply(m.chat, `*¡Esta característica esta desactivada!*`, m, )
}
return !0

}