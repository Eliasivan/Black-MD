import fetch from 'node-fetch';

var handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            `❓ Por favor ingresa el texto que deseas transformar.\n\nEjemplo: ${usedPrefix + command} hola`,
            m
        );
    }

    try {
        await m.react('🕒');
        conn.sendPresenceUpdate('composing', m.chat);

        // Realizar la solicitud a la API
        let res = await fetch(`https://api.popcat.xyz/v2/mock?text=${encodeURIComponent(text)}`);
        
        // Verificar si la solicitud fue exitosa
        if (!res.ok) {
            await m.react('❌');
            return conn.reply(m.chat, '⛔ Hubo un problema al conectar con la API. Intenta nuevamente más tarde.', m);
        }

        // Parsear la respuesta
        let data = await res.json();

        // Verificar si el texto procesado está presente en la respuesta
        if (!data || !data.text) {
            await m.react('❌');
            return conn.reply(m.chat, '⛔ No se pudo procesar el texto. Intenta nuevamente más tarde.', m);
        }

        // Enviar el texto procesado al usuario
        await conn.reply(m.chat, data.text, m);
        await m.react('✅️');
    } catch (error) {
        // Manejar errores generales
        await m.react('❌');
        return conn.reply(m.chat, `❌ Ocurrió un error: ${error.message}`, m);
    }
};

handler.command = ['mock'];
handler.help = ['mock <texto>'];
handler.tags = ['fun'];
export default handler;