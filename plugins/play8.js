import fetch from "node-fetch";
import yts from 'yt-search';

const handler = async (m, { conn, text, command }) => {
    try {
        if (!text.trim()) {
            await m.react('❌');
            return conn.reply(m.chat, `✳️ Por favor, ingresa el nombre de la música a descargar. Ejemplo: *${command} Albirroja Te amo de verdad - Talento del barrio*`, m, rcanal);
        }

        let ytSearchResults = await yts(text);
        let ytVideo = ytSearchResults.all?.[0] || ytSearchResults.videos?.[0];

        if (!ytVideo) {
            await m.react('❌');
            return conn.reply(m.chat, '🛑 No se encontraron resultados para tu búsqueda.', m, rcanal);
        }

        const { title, url, views, timestamp, ago } = ytVideo;

        const infoMessage = `
≡ *Información del Audio*
┌──────────────
▢ 🎵 Título: ${title || 'Desconocido'}
▢ 🔗 URL: ${url || 'No disponible'}
▢ 👀 Vistas: ${formatViews(views)}
▢ ⌚ Duración: ${timestamp || 'No disponible'}
▢ 📆 Subido: ${ago || 'No disponible'}
└──────────────
`;

        await conn.reply(m.chat, infoMessage, m, rcanal);

        try {
            const apiResponse = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`);
            const apiData = await apiResponse.json();
            const audioUrl = apiData?.result?.download?.url;

            if (!audioUrl) throw new Error('El enlace de audio no se generó correctamente.');

            await conn.sendMessage(m.chat, { 
                audio: { url: audioUrl }, 
                mimetype: 'audio/mpeg' 
            }, { quoted: m });

            await m.react('✅');
        } catch (error) {
            await m.react('❌');
            return conn.reply(m.chat, 'No se pudo enviar el audio. Intenta nuevamente.', m);
        }
    } catch (error) {
        await m.react('❌');
        return conn.reply(m.chat, `Ocurrió un error: ${error.message}`, m);
    }
};

handler.command = ['play'];
handler.tags = ['descargas'];
handler.help = ['play <texto>'];

export default handler;

function formatViews(views) {
    if (!views) return "No disponible";
    if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`;
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`;
    return views.toString();
}