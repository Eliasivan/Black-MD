let handler = async function (m, { conn, participants, groupMetadata }) {

  const normalizeJid = jid => jid?.replace(/[^0-9]/g, '')
  const senderNum = normalizeJid(m.sender)
  const botNums = [conn.user.jid, conn.user.lid].map(normalizeJid)
  const participantList = m.isGroup ? groupMetadata.participants : []

  const user = m.isGroup
    ? participantList.find(u => normalizeJid(u.id) === senderNum)
    : {}
  const bot = m.isGroup
    ? participantList.find(u => botNums.includes(normalizeJid(u.id)))
    : {}

  return m.reply(`Participantes: ${participantList.length}\nUsuario: ${user?.id || 'N/A'}\nBot: ${bot?.id || 'N/A'}`)
}

handler.command = ['lid']
handler.help = ['lid']
handler.tags = ['lid']

export default handler