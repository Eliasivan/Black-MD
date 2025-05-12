import axios from 'axios';

const youtubeMusic = async (m, { conn, args, usedPrefix, command }) => {
    try {
        // Verificar si se proporcionó un enlace de YouTube
        if (!args || !args[0]) {
            return conn.reply(
                m.chat,
                `❌ Por favor, proporciona un enlace válido de YouTube.\n\nEjemplo de uso:\n${usedPrefix}${command} https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
                m
            );
        }

        const youtubeUrl = args[0];

        // Validar el enlace de YouTube
        const isYoutubeLink = (url) => {
            const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
            return pattern.test(url);
        };

        if (!isYoutubeLink(youtubeUrl)) {
            return conn.reply(
                m.chat,
                `❌ El enlace proporcionado no es válido. Asegúrate de que sea un enlace de YouTube.`,
                m
            );
        }

        // Reaccionar con un emoji para indicar que el proceso ha comenzado
        await m.react('⏳');

        // Llamar a la API de descarga
        const downloadApi = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(youtubeUrl)}`;
        const response = await axios.get(downloadApi);

        // Verificar si la API devolvió un resultado válido
        if (!response.data || !response.data.result || !response.data.result.url) {
            return conn.reply(
                m.chat,
                `❌ Hubo un problema al intentar descargar el audio. Por favor, intenta nuevamente más tarde.`,
                m
            );
        }

        const { url: audioUrl, title } = response.data.result;

        // Enviar el archivo de audio al chat
        await conn.sendFile(
            m.chat,
            audioUrl,
            `${title}.mp3`,
            `🎵 *Título:* ${title}\n✅ ¡Aquí tienes tu archivo de audio descargado con éxito!`,
            m
        );

        // Reaccionar con un emoji al completar el proceso
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

// Definición de metadatos del comando
youtubeMusic.help = ['ytmp3']; // Ayuda para el comando
youtubeMusic.tags = ['downloader']; // Categoría del comando
youtubeMusic.command = ['ytmp3', 'ytaudio']; // Alias del comando

export default youtubeMusic;