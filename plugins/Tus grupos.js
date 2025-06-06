import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
    m.react(rwait)

    if (command === 'pussy') {
        let xp = await conn.getFile(global.API('fgmods', '/api/nsfw/pussy', {}, 'apikey'))
        conn.sendFile(m.chat, xp.data, 'img.jpg', `${mssg.random} *${command}*`, m)
        m.react(xmoji)
    } else {
        throw `❎ ${mssg.invalidCommand}`
    }
}

handler.help = ['pussy']
handler.tags = ['nsfw']
handler.command = ['pussy']

export default handler