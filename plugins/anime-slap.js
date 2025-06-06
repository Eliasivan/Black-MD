import fetch from 'node-fetch';
import { sticker } from '../lib/sticker.js';

let actionHandler = async (msg, { conn, args, usedPrefix, command }) => {
    let target;
    if (msg.isGroup) {
        target = msg.mentionedJid[0] ? msg.mentionedJid[0] : msg.quoted ? msg.quoted.sender : false;
    } else {
        target = msg.chat;
    }

    if (!target) throw `⚡️ No se ha seleccionado un usuario.\n\n💡 Ejemplo: ${usedPrefix + command} @usuario`;

    let targetName = conn.getName(target);
    let senderName = conn.getName(msg.sender);
    msg.react('⏳');

    let response = await fetch(`https://api.waifu.pics/sfw/slap`);
    if (!response.ok) throw await response.text();

    let jsonData = await response.json();
    let { url } = jsonData;

    let generatedSticker = await sticker(null, url, un golpe fuerte`, `${targetName}`);
    conn.sendFile(msg.chat, generatedSticker, null, { asSticker: true }, msg);
    msg.react('💥');
}

handler.help = ['golpear @usuario'];
handler.tags = ['anime'];
handler.command = ['golpear'];

export default handler;