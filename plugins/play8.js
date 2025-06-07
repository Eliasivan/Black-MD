import yts from 'yt-search';
import fetch from 'node-fetch';

let limit = 320;

let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) throw `✳️ Usa el comando de esta forma: *${usedPrefix + command} [Nombre de la canción`;

    let res = await yts(text);
    let vid = res.videos[0];
    if (!vid) throw `✳️ No se encontró ningún resultado para tu búsqueda.`;

    let { title, url, timestamp, views, ago } = vid;

    m.react('🎧');

    let infoMessage = await conn.reply(m.chat, infoMessage, m);

    try {
        m.react('📥');
        let apiRes = await fetch(global.API('fgmods', '/api/downloader/ytmp3', { url }, 'apikey'));
        let data = await apiRes.json();

        if (!data.result || !data.result.dl_url) throw '❌ Error MB.`;

        let audioBuffer = await fetch(dl_url).then(res => res.buffer());
        await conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m });
        m.react('✅');
    } catch (error) {
        throw `❌ Ocurrió un error: ${error}`;
    }
};

handler.help = ['play'];
handler.tags = ['dl'];
handler.command = ['play', 'playvid'];
handler.disabled = false;

export default handler;