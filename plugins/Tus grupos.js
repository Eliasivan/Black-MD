import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
    if (!db.data.chats[m.chat].nsfw && m.isGroup) return m.reply('🚩 *¡Estos comandos están desactivados!*');

    m.react(rwait);

    if (command === 'pussy') {
        let xp = await conn.getFile('https://api.fgmods.xyz/api/nsfw-nime/pussy?apikey=fg_ZIKajB', `*✅ Aquí tienes una Pussy*`, m);
        m.react('🤗');
    } else {
        throw `Comando no válido. Usa: ${usedPrefix}pussy`;
    }
}

handler.help = ['pussy'];
handler.tags = ['nsfw'];
handler.command = ['pussy'];

export default handler