/*import axios from 'axios';

const youtubeMusic = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args || !args[0]) {
            return conn.reply(
                m.chat,
                `❌ Por favor, proporciona un enlace válido de YouTube.\n\nEjemplo de uso:\n${usedPrefix}${command} https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
                m
            );
        }

        const videoUrl = args[0];

        const isYoutubeLink = (url) => {
            const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
            return pattern.test(url);
        };

        if (!isYoutubeLink(videoUrl)) {
            return conn.reply(
                m.chat,
                `❌ El enlace proporcionado no es válido. Asegúrate de que sea un enlace de YouTube.`,
                m
            );
        }

        await m.react('⏳');

        const apiURL = `https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(videoUrl)}&type=audio&quality=128kbps&apikey=russellxz`;
        const response = await axios.get(apiURL);

        if (!response.data || response.data.status !== true || !response.data.data || !response.data.data.audio) {
            return conn.reply(
                m.chat,
                `❌ Hubo un problema al intentar descargar el audio. Por favor, intenta nuevamente más tarde.`,
                m
            );
        }

        const { audio, title, thumbnail, duration } = response.data.data;

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

        if (thumbnail) {
            await conn.sendFile(
                m.chat,
                thumbnail,
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

youtubeMusic.help = ['ytmp3'];
youtubeMusic.tags = ['downloader'];
youtubeMusic.command = ['ytmp3', 'yttes'];

export default youtubeMusic;*/