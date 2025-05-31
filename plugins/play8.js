import fetch from "node-fetch";
import yts from 'yt-search';

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

const handler = async (m, { conn, text, command }) => {
    try {
        if (!text.trim()) {
            await m.react('❌'); // Reacción en caso de error
            return conn.reply(m.chat, `Por favor, ingresa el nombre de la música a descargar`, m);
        }

        let videoIdToFind = text.match(youtubeRegexID) || null;
        let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1]);

        if (videoIdToFind) {
            const videoId = videoIdToFind[1];
            ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId);
        }
        ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2play2 || ytplay2.length == 0) {
            await m.react('❌'); // Reacción en caso de no encontrar resultados
            return conn.reply(m.chat, '✧ No se encontraron resultados para tu búsqueda.', m);
        }

        let { title, thumbnail, timestamp, views, url, author } = ytplay2;
        title = title || 'no encontrado';
        thumbnail = thumbnail || 'no encontrado';
        timestamp = timestamp || 'no encontrado';
        views = views || 'no encontrado';
        url = url || 'no encontrado';
        author = author || 'no encontrado';

        const vistas = formatViews(views);
        const canal = author.name ? `${author.name} rcanal` : 'rcanal Desconocido';
        const infoMessage = `「✦」Descargando *<${title || 'Desconocido'}>*\n\n> ✧ Canal » *${canal}*\n> ✰ Vistas » *${vistas || 'Desconocido'}*\n> ⴵ Duración » *${timestamp || 'Desconocido'}*\n`;

        const thumb = (await conn.getFile(thumbnail))?.data;
        const JT = {
            contextInfo: {
                externalAdReply: {
                    title: 'Goku-Black-Bot-MD',
                    body: 'Descarga de música',
                    mediaType: 1,
                    previewType: 0,
                    mediaUrl: url,
                    sourceUrl: url,
                    thumbnail: thumb,
                    renderLargerThumbnail: true,
                },
            },
        };

        await conn.reply(m.chat, infoMessage, m, JT);

        if (command === 'play' || command === 'yta' || command === 'ytmp3' || command === 'playaudio') {
            try {
                const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json();
                const resulta = api.result;
                const result = resulta.download.url;

                if (!result) throw new Error('⚠ El enlace de audio no se generó correctamente.');

                // Enviar como nota de voz
                await conn.sendMessage(m.chat, { 
                    audio: { url: result }, 
                    mimetype: 'audio/ogg', 
                    ptt: true 
                }, { quoted: m });

                await m.react('✅'); // Reacción en caso de éxito
            } catch (e) {
                await m.react('❌'); // Reacción en caso de error
                return conn.reply(m.chat, '⚠︎ No se pudo enviar el audio como nota de voz. Intenta nuevamente.', m);
            }
        } else {
            await m.react('❌'); // Reacción en caso de comando no reconocido
            return conn.reply(m.chat, '✧︎ Comando no reconocido.', m);
        }
    } catch (error) {
        await m.react('❌'); // Reacción en caso de error
        return conn.reply(m.chat, `⚠︎ Ocurrió un error: ${error}`, m);
    }
};

// Ajuste para que el bot reconozca el comando
handler.command = ['play', 'yta', 'ytmp3', 'playaudio']; // Comandos soportados
handler.tags = ['descargas'];
handler.help = ['play <texto>']; // Ayuda visible para el usuario
handler.group = true;

export default handler;

function formatViews(views) {
    if (views === undefined) {
        return "No disponible";
    }

    if (views >= 1_000_000_000) {
        return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`;
    } else if (views    } else if (views >= 1_000) {
        return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`;
    }
    return views.toString();
}