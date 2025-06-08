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
        if (!data || !data.result) {
            return conn.reply(m.chat, `La IA no devolvió un campo 'result' válido. Respuesta completa: ${JSON.stringify(data)}`, m);
        }

        await conn.reply(m.chat, `${data.result}`, m);
    } catch (error) {
        return conn.reply(m.chat, `Ocurrió un error: ${error.message}`, m);
    }
};

handler.command = ['blackai'];
handler.help = ['blackai <texto>'];
handler.tags = ['tools'];

export default handler;