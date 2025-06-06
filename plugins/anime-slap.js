import fetch from 'node-fetch';
import { sticker } from '../lib/sticker.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let target;
    if (m.isGroup) {
        target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    } else {
        target = m.chat;
    }

    if (!target) throw `🚩 No mencion targetName = conn.getName(target);
    let senderName = conn.getName(m.sender);
    m.react('⏳');

    try {
        let response = await fetch(`https://api.waifu.pics/sfw/slap`);
        if (!response.ok) throw `❌ Error al obtener datos de la API.`;

        await conn.sendFile(m.chat, generatedSticker, null, { asSticker: true }, m);
        m.react('💥');
    } catch (error) {
        throw `❌ Ocurrió un error: ${error}`;
    }
};

handler.help = ['bofetada @usuario'];
handler.tags = ['anime'];
handler.command = /^(bofetada0|slap)$/i;

export default handler;