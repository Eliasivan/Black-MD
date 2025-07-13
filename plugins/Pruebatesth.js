/*import fetch from "node-fetch";
import yts from 'yt-search';

const handler = async (m, { conn, text, command }) => {
    if (!text.trim()) {
        return conn.reply(m.chat, `𝄞 Ingresa el nombre o enlace del video de YouTube para descargar.`, m, rcanal);
    }

    try {
        const search = await yts(text);
        if (!search.all || search.all.length === 0) {
            return m.reply('No se encontraron resultados para tu búsqueda.');
        }

        const videoInfo = search.all[0];
        const { title, thumbnail, url } = videoInfo;

        const thumb = (await conn.getFile(thumbnail))?.data;
        const infoMessage = `♬ Descargando *${title}*
⚘ Enlace: ${url}`;
        await conn.reply(m.chat, infoMessage, m);

        if (command === 'play2' || command === 'ytmp4') {
            const apiKey = "GataDios";
            try {
                const apiUrl = `https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(url)}&type=video&quality=480p&apikey=${apiKey}`;
                const res = await fetch(apiUrl);

                if (!res.ok) {
                    throw new Error(`Hubo un problema al conectar con la API. Código de estado: ${res.status}`);
                }

                const data = await res.json();
                if (!data || !data.data || !data.data.url) {
                    throw new Error(`No se pudo obtener un enlace de descarga válido. Respuesta completa: ${JSON.stringify(data)}`);
                }

                const { url: downloadUrl } = data.data;
                await conn.sendMessage(m.chat, {
                    video: { url: downloadUrl },
                    caption: `☄︎ Aquí tienes tu video\n🎥 Título: ${title}`,
                    thumbnail: thumb,
                }, { quoted: m });
            } catch (error) {
                return m.reply(`*Error:* ${error.message}`);
            }
        } else {
            throw "Comando no reconocido.";
        }
    } catch (error) {
        return m.reply(`*Error:* ${error.message}`);
    }
};

handler.command = ['play2', 'ytmp4'];
handler.help = ['play2 <enlace o nombre>', 'ytmp4 <enlace o nombre>'];
handler.tags = ['downloader'];

export default handler;/*