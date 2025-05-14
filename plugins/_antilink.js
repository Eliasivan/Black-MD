let linkRegex = /(https?:\/\/(?:www\.)?(?:t\.me|telegram\.me|whatsapp\.com)\/\S+)|(https?:\/\/chat\.whatsapp\.com\/\S+)|(https?:\/\/whatsapp\.com\/channel\/\S+)/i

export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return !0
  if (!m.isGroup) return !1
  let chat = global.db.data.chats[m.chat]
  let delet = m.key.participant
  let bang = m.key.id
  let bot = global.db.data.settings[this.user.jid] || {}
  const isGroupLink = linkRegex.exec(m.text)
  const grupo = `https:                    

  if (isAdmin && chat.antiLink && m.text.includes(grupo)) {
    return conn.reply(m.chat, `//chat.whatsapp.com`

  if (isAdmin && chat.antiLink && m.text.includes(grupo)) {
    return conn.reply(m.chat, `🏷️ *¡Hey, admin!* El anti-link está activo, pero eres admin, ¡salvado! 😎`, m, rcanal)
  }

  if (chat.antiLink && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
      if (m.text.includes(linkThisGroup)) return !0
    }

    await conn.reply(m.chat, `📎 *¡Enlace detectado!* 🚨\n\n*${await this.getName(m.sender)}* mandaste un enlace prohibido, ¡serás eliminado! 👮‍♂️`, m, rcanal)

    // Mencionar a los admins
    let admins = await conn.groupMetadata(m.chat).admins
    await conn.reply(m.chat, `👀 *Admins, atención!* ${admins.map(admin => `@${admin.split('@')[0]}`).join(', ')}\n\nUn usuario ha enviado un enlace prohibido.`, m, { mentions: admins })

    if (!isBotAdmin) {
      return conn.reply(m.chat, `🌼 *No soy admin, no puedo eliminar intrusos* 😔`, m, rcanal)
    }

    if (isBotAdmin) {
      await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    } else if (!bot.restrict) {
      return conn.reply(m.chat, `*¡Esta característica está desactivada!* 🚫`, m, rcanal)
    }
  }
  return !0
}