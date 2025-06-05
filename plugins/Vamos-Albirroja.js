//IVAN 
let handler = async function (m, { conn, participants, groupMetadata }) {
if (!m.isGroup) return m.reply('Este comando solo funciona en grupos.')

const normalizeJid = jid => jid?.replace(/[^0-9]/g, '')
const participantList = groupMetadata.participants || []

const result = participantList.map(participant => ({
id: participant.id,
lid: participant.lid || null,
admin: participant.admin || null
}))

return m.reply(JSON.stringify(result, null, 2))
}

handler.command = ['lid1']
handler.help = ['lid']
handler.tags = ['group']

export default handler