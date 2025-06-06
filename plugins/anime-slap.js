import fetch from 'node-fetch';
import { sticker } from '../lib/sticker.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let target;

    if (m.isGroup) {
        target = m.mentionedJid && m.mentionedJid[0];
    }

    if (!target) throw `🚩 No mencionaste a nadie.\n💡 Usa: ${usedPrefix}${command} @usuario`;

    let targetName = conn.getName(target);
    let senderName = conn.getName(m.sender);

    // Bofetada
    m.react('⏳');

    try {
ap`);
        if (!response.ok) throw `❌ Error al obtener datos de la API.`;

        let jsonData = await response.json();
        let { url } = jsonData;

        // merecido xd
        let generatedSticker = await sticker(null, url, `👋 ${senderName} le ha dado una bofetadaofetada @usuario'];
handler.tags = ['anime'];
handler.command = /^(bofetada|slap)$/i;
handler.group = true;

export default handler;