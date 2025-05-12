
import axios from 'axios';

const youtubeMusic = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args || !args[0]) {
            return conn.reply(
                m.chat,
                `❌ Por favor, proporciona un término de búsqueda o un enlace válido de YouTube.\n\nEjemplo de uso:\n${usedPrefix}${command} https://www.youtube.com/watch?v=dQw4w9WgXcQ\n${usedPrefix}${command} nombre de la canción`,
                m
            );
        }

        const inputQuery = args.join(' ');

        await m.react('⏳');

        const apiUrl = `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(inputQuery)}`;
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data.result || !response.data.result.audio || !response.data.result.title) {
            return conn.reply(
                m.chat,
                `❌ No se encontraron resultados o hubo un problema al procesar tu solicitud.`,
                m
            );
        }

        const { audio, title, thumb, duration } = response.data.result;

        const videoInfo = `
🎵 *Título:* ${title}
⏱️ *Duración:* ${duration}
✅ *Audio Descargado con Éxito*
        `.trim();

        await conn.sendFile(
            m.chat,
            audio,
            `${title}.mp3`,
            videoInfo,
            m
        );

        if (thumb) {
            await conn.sendFile(
                m.chat,
                thumb,
                'thumbnail.jpg',
                `🖼️ *Miniatura del Video*`,
                m
            );
        }

        await m.react('✅');
    } catch (error) {
        console.error(error);
        conn.reply(
            m.chat,
            `❌ Ocurrió un error al procesar tu solicitud:\n${error.message}`,
            m
        );
    }
};

youtubeMusic.help = ['ytplaymp3'];
youtubeMusic.tags = ['downloader'];
youtubeMusic.command = ['ytplaymp3', 'ytplay'];

export default youtubeMusic;