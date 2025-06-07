import yts from 'yt-search';
import fetch from 'node-fetch';

let limit = 320;

let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) throw `✳️ Usa el comando de esta forma: *${usedPrefix + command} [Nombre de la canción o video]*`;

    let res = await yts(text);
    let vid = res.videos[0];
    if (!vid) throw `✳️ No se encontró ningún resultado para tu búsqueda.`;

    let { title, url, timestamp, views, ago } = vid;

*
┌──────────────
▢ 🎵 Título: ${title}
▢ ⌚ Duración: ${timestamp}
▢ 📆 Subido: ${ago}
▢ 👀 Vistas: ${views.toLocaleString()}
└──────────────`;

    await conn.reply(m.chat, infoMessage, m);

    try {
        m.react('📥: dl_url, title: fileTitle, filesize } = data.result;

        let sizeMB = parseFloat(filesize.replace(' MB', ''));
        if (sizeMB > limit) throw `⚠️ El archivo excede el límite permitido de ${limit} MB.`;

        let audioBuffer = await fetch(dl_url).then❌ Ocurrió un error: ${error}`;
    }
};

handler.help = ['play'];
handler.tags = ['dl'];
handler.command = ['play', 'playvid'];
handler.disabled = false;

export default handler;