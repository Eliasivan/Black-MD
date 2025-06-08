import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";

const handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text.trim()) {
            return conn.reply(m.chat, `✎ Ingresa el nombre o enlace de la música o video a descargar.`, m);
        }

        const search = await yts(text);
        if (!search.all || search.all.length === 0) {
            return m.reply('No se encontraron resultados para tu búsqueda.');
        }

        const videoInfo = search.all[0];
        const { title, thumbnail, timestamp, views, url } = videoInfo;
        const vistas = formatViews(views);
        const infoMessage = `☄ Descargando *${title}*\n\n💥 Canal: *${videoInfo.author.name || 'Desconocido'}*\n☄ Vistas: *${vistas}*\n💥 Duración: *${timestamp}*\n☄ Publicación: *${videoInfo.ago}*\n🔗 Enlace: ${url}`;

        const thumb = (await conn.getFile(thumbnail))?.data;
        const JT = {
            contextInfo: {
                externalAdReply: {
                    title: 'Descarga de Video/Música',
                    body: 'Goku Black Bot',
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

        if (command === 'play2' || command === 'ytv' || command === 'mp4') {
            const apiKey = "sylph-dc801b66a8";
            try {
                const res = await fetch(`https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(url)}&apikey=${apiKey}`);
                const data = await res.json();

                if (!data || !data.result || !data.result.download_url) {
                    throw new Error(`No se pudo obtener un enlace de descarga válido. Respuesta: ${JSON.stringify(data)}`);
                }

                const downloadUrl = data.result.download_url;
                await conn.sendMessage(m.chat, {
                    video: { url: downloadUrl },
                    fileName: `${title}.mp4`,
                    mimetype: 'video/mp4',
                    caption: `✎﹏Aquí tienes tu video`,
                    thumbnail: thumb
                }, { quoted: m });
            } catch (error) {
                return m.reply(`𓁏 *Error:* ${error.message}`);
            }
        } else if (command === 'mp3' || command === 'yta') {
            return m.reply(`La descarga de audio no está disponible con esta API.`);
        } else {
            throw "Comando no reconocido.";
        }
    } catch (error) {
        return m.reply(`𓁏 *Error:* ${error.message}`);
    }
};

handler.command = handler.help = ['play2', 'mp4', 'ytv'];
handler.tags = ['downloader'];

export default handler;

function formatViews(views) {
    if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'k (' + views.toLocaleString() + ')';
    } else {
        return views.toString();
    }
}