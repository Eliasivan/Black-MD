import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            `Por favor ingresa el texto para enviar a la IA.\n\nEjemplo: .blackai Hola`,
            m
        );
    }

    try {
        const apiKey = "sylph-dc801b66a8";
        let res = await fetch(`https://api.sylphy.xyz/ai/blackbox?text=${encodeURIComponent(text)}&apikey=${apiKey}`);
        if (!res.ok) {
            return conn.reply(m.chat, `Hubo un problema al conectar con la API. Código de estado: ${res.status}`, m);
        }

        let data = await res.json();
        if (!data) {
            return conn.reply(m.chat, `No se pudo obtener una respuesta válida de la IA. La respuesta fue: ${JSON.stringify(data)}`, m);
        }

        if (!data.response) {
            return conn.reply(m.chat, `La IA no devolvió un campo 'response' válido. Respuesta completa: ${JSON.stringify(data)}`, m);
        }

        await conn.reply(m.chat, `🤖 Respuesta de la IA:\n${data.response}`, m);
    } catch (error) {
        return conn.reply(m.chat, `Ocurrió un error: ${error.message}`, m);
    }
};

handler.command = ['blackai'];
handler.help = ['blackai <texto>'];
handler.tags = ['tools'];

export default handler;