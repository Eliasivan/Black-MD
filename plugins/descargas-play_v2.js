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

        const url = args[0];

        // Validar el enlace de YouTube
        const isValidYoutubeURL = (url) => {
            const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
            return pattern.test(url);
        };

        if (!isValidYoutubeURL(url)) {
            return conn.reply(
                m.chat,
                `❌ El enlace proporcionado no es válido. Asegúrate de que sea un enlace de YouTube.`,
                m
            );
        }

        // Reaccionar con un emoji para indicar que el proceso ha comenzado
        await m.react('⏳');

        // Construir la URL de la API
        const apiUrl = `https://ytdl.sylphy.xyz/dl/mp3?url=${encodeURIComponent(url)}`;

        // Realizar la solicitud a la API
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        // Verificar si la API devolvió un resultado
        if (!response || response.status !== 200) {
            return conn.reply(
                m.chat,
                `❌ Hubo un problema al procesar tu solicitud. Por favor, intenta nuevamente más tarde.`,
                m
            );
        }

        // Verificar el tamaño del archivo (opcional)
        if (response.data.byteLength > 10 * 1024 * 1024) { // 10 MB
            return conn.reply(
                m.chat,
                `❌ El archivo de audio es demasiado grande para enviarse.`,
                m
            );
        }

        // Extraer el nombre del archivo del encabezado (si está disponible)
        const fileName = response.headers['content-disposition']
            ? response.headers['content-disposition'].split('filename=')[1].replace(/"/g, '')
            : 'audio.mp3';

        // Enviar el archivo de audio al chat
        await conn.sendFile(
            m.chat,
            Buffer.from(response.data),
            fileName,
            `🎵 Aquí tienes tu archivo de audio descargado con éxito.\n🎶 Disfrútalo!`,
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
youtubeMusic.command = ['ytmp', 'ytaudio']; // Alias del comando

export default youtubeMusic;