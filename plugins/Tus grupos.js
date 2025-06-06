import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
    if (!global.db.data.chats[m.chat].nsfw) throw `🚫 ${mssg.gpNsfw(usedPrefix)}`
    let user = global.db.data.users[m.sender].age
    if (user < 17) throw `❎ ${mssg.nsfwAge}`

    m.react(rwait)

    if (command === 'pussy') {
        let xp = await conn.getFile(global.API('fgmods', '/api/nsfw/pussy', {}, 'apikey'))
        conn.sendFile(m.chat, xp.data, 'img ${mssg.random} *${command}*`, m)
        m.react(xmoji)
    } else {
        throw `❎ ${mssg.invalidCommand}`
    }
}

handler.help = ['pussy']
handler.tags = ['nsfw']
handler.command = /^pussy$/i // Solo acepta el comando "pussy"
handler.diamond = true
handler.register = true
handler.group = true

export default handler