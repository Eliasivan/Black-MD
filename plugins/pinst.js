import axios from 'axios';

const igstory = async (m, { conn, args, usedPrefix, command, Func, Api }) => {
    try {
        // Verificar si los argumentos están presentes
        if (!args || !args[0]) {
            return conn.reply(
                m.chat,
                Func.example(
                    usedPrefix,
                    command,
                    'https://instagram.com/stories/username/123456789?igshid=example'
                ),
                m
            );
        }

        // Reaccionar con un emoji para indicar que el proceso ha comenzado
        await m.react('⏳');

        // Registrar el tiempo de inicio del proceso
        const startTime = new Date();

        // Llamar a la API para obtener las historias de Instagram
        const response = await Api.get('api/igs', {
            q: args[0], // Enviar el argumento (link o username) a la API
        });

        // Verificar si la API devolvió un error
        if (!response.status) {
            return conn.reply(
                m.chat,
                `❌ Error: ${response.message || 'Hubo un problema con la solicitud.'}`,
                m
            );
        }

        // Procesar y enviar cada archivo (video o imagen) obtenido de la API
        for (const [index, item] of response.data.entries()) {
            const fileType = item.type === 'video' ? 'mp4' : 'jpg'; // Determinar el tipo de archivo
            const fileName = Func.filename(fileType); // Generar un nombre de archivo único

            // Enviar el archivo al chat
            await conn.sendFile(
                m.chat,
                item.url,
                fileName,
                `✨ *Tiempo de proceso:* ${new Date() - startTime} ms\n📄 *Archivo*: ${index + 1}/${response.data.length}`,
                m
            );

            // Introducir un retraso para evitar problemas con la API o saturar el chat
            await Func.delay(1500);
        }

        // Reaccionar con un emoji cuando el proceso termine
        await m.react('✅');
    } catch (error) {
        // Manejar errores y mostrarlos al usuario
        conn.reply(
            m.chat,
            `❌ Ocurrió un error al procesar tu solicitud:\n${Func.jsonFormat(error.message || error)}`,
            m
        );
    }
};

igstory.help = ['igstory']; // Ayuda para el comando
igstory.tags = ['downloader']; // Categoría del comando
igstory.command = ['igs', 'igstory']; // Alias del comando
igstory.limit = true; // Establecer límite para el uso del comando

export default igstory;