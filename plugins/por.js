import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
    if (!text) throw `Por favor, ingresa el texto que deseas convertir en Pikachu.\nEjemplo: .mock GokuBlack`;

    try {
        let res = await fetch(`https://api.popcat.xyz/v2/mock?text`);
        if (!res.ok) throw `Error al obtener imagen. Código de estado: ${res.status}`;
        let buffer = await res.buffer();
        await conn.sendMessage(m.chat, { image: buffer}, { quoted: m });
    } catch (error) {
        throw error;
    }
}

handler.help = ['mock']
handler.tags = ['tools']
handler.command = ['mock']

export default handler