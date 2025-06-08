import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
    if (!text) throw `Por favor, ingresa el texto que deseas convertir en alert.\nEjemplo: .alert GokuBlack`;

    try {
        let res = await fetch(`https://api.popcat.xyz/v2/alert?text=${text}`);
        if (!res.ok) throw `Error al obtener imagen. Código de estado: ${res.status}`;
        let buffer = await res.buffer();
        await conn.sendMessage(m.chat, { image: buffer}, { quoted: m });
    } catch (error) {
        throw error;
    }
}

handler.help = ['aler']
handler.tags = ['tools']
handler.command = ['alert']

export default handler