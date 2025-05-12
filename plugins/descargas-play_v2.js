import axios from 'axios';

const youtubeMusic = async (m, { conn, args, usedPrefix, command }) => {
    try {
        // Verificar si se proporcionó una consulta de búsqueda o un enlace de YouTube
        if (!args || !args[0]) {
            return conn.reply(
                m.chat,
                `❌ Por favor, proporciona un enlace válido de YouTube o un término de búsqueda.\n\nEjemplo de uso:\n${usedPrefix}${command} https://www.youtube.com/watch?v=dQw4w9WgXcQ\n${usedPrefix}${command} nombre de la canción`,
                m
            );
        }

        const input = args.join(' '); // Unir los argumentos
        let videoUrl;

        // Detectar si el input es un enlace de YouTube
        const isYoutubeLink = (url) => {
            const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
            return pattern.test(url);
        };

        if (isYoutubeLink(input)) {
            videoUrl = input; // Si es un enlace, usarlo directamente
        } else {
            // Si es un texto, buscar el video usando la API de búsqueda
            const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(input)}`;
            const searchResponse = await axios.get(searchApi);

            if (!searchResponse.data || !searchResponse.data[0]) {
                return conn.reply(
                    m.chat,
                    `❌ No se encontraron resultados para "${input}". Por favor, intenta con otro término de búsqueda.`,
                    m
                );
            }

            // Usar el primer resultado de la búsqueda
            videoUrl = searchResponse.data[0].url;
        }

        // Reaccionar con un emoji para indicar que el proceso ha comenzado
        await m.react('⏳');

        // Llamar a la API de descarga
        const downloadApi = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(videoUrl)}`;
        const downloadResponse = await axios.get(downloadApi);

        // Verificar si la API de descarga devolvió un resultado
        if (!downloadResponse.data || !downloadResponse.data.result || !downloadResponse.data.result.url) {
            return conn.reply(
                m.chat,
                `❌ Hubo un problema al intentar descargar el audio. Por favor, intenta nuevamente más tarde.`,
                m
            );
        }

        const { url: audioUrl, title } = downloadResponse.data.result;

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
youtubeMusic.help = ['ytmp3', 'ytbuscar']; // Ayuda para el comando
youtubeMusic.tags = ['downloader']; // Categoría del comando
youtubeMusic.command = ['ytmp', 'ytaudio', 'ytbuscar']; // Alias del comando

export default youtubeMusic;