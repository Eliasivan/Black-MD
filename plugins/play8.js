import fetch from "node-fetch";
import yts from 'yt-search';

const handler = async (m, { conn, text, command }) => {
    try {
        if (!text.trim()) {
            await m.react('❌');
            return conn.reply(m.chat, `✳️ Por favor, ingresa el nombre de la música a descargar. Ejemplo: *${command} Shape of You*`, m, rcanal);
        }

        let ytSearchResults = await yts(text);
        let ytVideo = ytSearchResults.videos?.[0] || ytSearchResults.all?.[0];

        if (!ytVideo) {
            await m.react('❌');
            return conn.reply(m.chat, '✳️ No se encontraron resultados para tu búsqueda.', m);
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

        await conn.reply(m.chat, infoMessage, m);

        try {
            const apiUrl = `https://api.vreden.my.id/api/ytmp3?url=${url}`;
            const apiResponse = await fetch(apiUrl);

            if (!apiResponse.ok) {
                throw new Error(`La API respondió con un estado ${apiResponse.status}`);
            }

            const apiData = await apiResponse.json();

            if (!apiData?.result?.mp3) {
                throw new Error('El enlace de audio no se generó correctamente.');
            }

            const audioUrl = apiData.result.mp3;

            await conn.sendMessage(m.chat, { 
                audio: { url: audioUrl }, 
                mimetype: 'audio/mpeg', 
                fileName: `${title || 'audio'}.mp3`
            }, { quoted: m });

            await m.react('✅');
        } catch (error) {
            await m.react('❌');
            return conn.reply(m.chat, `❌ No se pudo enviar el audio. Error: ${error.message}`, m);
        }
    } catch (error) {
        await m.react('❌');
        return conn.reply(m.chat, `❌ Ocurrió un error: ${error.message}`, m);
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
    if (views >= 1_000)