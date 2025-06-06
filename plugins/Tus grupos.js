import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
    m.react(rwait)

    if (command === 'pussy') {
        let xp = await conn.getFile('https://api.fgmods.xyz/api/nsfw-nime/pussy?apikey=fg_ZIKajBcu')
        conn.sendFile(m.chat, xp.data, 'img.jpg', `✅ Aquí tienes una Pussy*`, m)
        m.react(xmoji)
    } else {
        throw `Comando no válido. Usa: ${usedPrefix}pussy`
    }
}

handler.help = ['pussy']
handler.tags = ['nsfw']
handler.command = ['pussy']

export default handler

