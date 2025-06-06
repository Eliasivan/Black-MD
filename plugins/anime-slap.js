import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
    let who;
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    } else {
        who = m.chat;
    }
    if (!who) throw `🚩 Por favor, etiqueta o menciona a alguien.\n💡 Usa: ${usedPrefix}${command} @usuario`;

    let name = conn.getName(who);
    let name2 = conn.getName(m.sender);

    await conn.sendMessage(m.chat, { react: { text: '👊🏻', key: m.key } });

    let str = `${name2} ha golpeado a ${name}`.trim();

    try {
        let response = await fetch(`https://api.waifu.pics/sfw/slap`);
        if (!response.ok) throw `❌ Error al obtener datos de la API.`;

        let jsonData = await response.json();
        let { url } = jsonData;

        await conn.sendMessage(m.chat, { image: { url }, caption: str, mentions: [m.sender, who] }, { quoted: m });
    } catch (error) {
        throw `❌ Ocurrió un error: ${error}`;
    }
};

handler.help = ['bofetada @usuario'];
handler.tags = ['fun'];
handler.command = /^(slap|bofetada)$/i;
handler.group = true;

export default handler;