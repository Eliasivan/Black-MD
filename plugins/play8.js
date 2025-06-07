import yts from 'yt-search';
import fetch from 'node-fetch';

let limit = 320;

let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) throw `✳️ Usa el comando de esta forma: *${usedPrefix + command} [Nombre de la canción o video]*`;

    let res = await yts(text);
    let vid = res.videos[0];
    if (!vid) throw `✳️ No se encontró ningún resultado para tu búsqueda.`;

    let { title, url, timestamp, views, ago } = vid;

    m.react('🎧');

    let infoMessage = `
≡ *Descarga de Música*
┌──────────────
▢ 🎵 Título: ${title}
▢ ⌚ Duración: ${timestamp}
▢ 📆 Subido: ${ago}
▢ 👀 Vistas: ${views.toLocaleStringfgmods', '/api/downloader/ytmp3', { url }, 'apikey'));
        let data = await apiRes.json();

        if (!data.result || !data.result.dl_url) throw '❌ Error al descargar el archivo de la API.';

        let { dl_url, size, sizeB } = data.result;

        if (sizeB > limit * 1024) throw `⚠️ El archivo excede el límite permitido de ${limit} MB.`;

        await conn.sendFile(m.chat, dl_url, `${title}.mp3`, `≡ *Descpletada*\n\n▢ 🎵 Título: ${title}\n▢ 📦 Tamaño: ${size}`, m, false, { mimetype: 'audio/mpeg', asDocument: true });
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