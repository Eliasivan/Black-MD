import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            `❓ Por favor ingresa el mensaje que deseas enviar al chatbot.\n\nEjemplo: .chatbot ¿Quién te creó?`,
            m
        );
    }

    try {
        // Goku-Black-Bot-MD 
        let res = await fetch(`https://api.popcat.xyz/v2/chatbot?msg=${encodeURIComponent(text)}&owner=Zero+Two&botname=Pop+Cat`);
        
        
        if (!res.ok) {
            return conn.reply(m.chat, `⛔ Hubo un problema al conectar con la API. Código de estado: ${res.status}`, m);
        }

        
        let data = await res.json();
        
        
        if (!data || !data.response) {
            return conn.reply(m.chat, `⛔ No se pudo obtener una respuesta del chatbot. Intenta nuevamente más tarde.`, m);
        }

        await conn.reply(m.chat, `🤖 ${data.response}`, m);
    } catch (error) {
        
        return conn.reply(m.chat, `❌ Ocurrió un error: ${error.message}`, m);
    }
};

handler.command = ['chatbot'];
handler.help = ['chatbot <mensaje>'];
handler.tags = ['tools'];
handler.group = true;

export default handler;