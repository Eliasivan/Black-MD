import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            `Por favor ingresa el texto que deseas.\n\nEjemplo: .alert Ivan`,
            m
        );
    }

    try {
        let res = await fetch(`https://api.popcat.xyz/v2/alert?text=${encodeURIComponent(text)}`);
        if (!res.ok) {
            return conn.reply(m.chat, `Hubo un problema al conectar con la API. Código de estado: ${res.status}`, m);
        }

        let data = await res.json();
        if (!data || !data.message) {
            return conn.reply(m.chat, `No se pudo obtener una respuesta válida de la API.`, m);
        }

        await conn.reply(m.chat, `🚨 Alerta: ${data.message}`, m);
    } catch (error) {
        return conn.reply(m.chat, `Ocurrió un error: ${error.message}`, m);
    }
};

handler.command = ['alert'];
handler.help = ['alert <texto>'];
handler.tags = ['tools'];
handler.group = true;

export default handler;