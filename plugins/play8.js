import yts from 'yt-search';

let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) throw `✳️ Usa el comando de esta forma: *${usedPrefix + command} [Nombre de la canción o video]*`;

    let res = await yts(text);
    let vid = res.videos[0];
    if (!vid) throw `✳️ No se encontró ningún resultado para tu búsqueda.`;

    let { title, url, timestamp, views, ago } = vid;

    m.react('🎧');

    let infoMessage = `
≡ *Información del Video*
┌──────────────
▢ 🎵 Título: ${title}
▢ ⌚ Duración: ${timestamp}
▢ 📆 Subido: ${ago}
▢ 👀 Vistas: ${views.toLocaleString()}
▢ 🔗 Enlace: ${url}
└──────────────`;

    await conn.reply(m.chat, infoMessage, m);
};

handler.help = ['play'];
handler.tags = ['info'];
handler.command = ['play', 'playvid'];
handler.disabled = false;

export default handler;