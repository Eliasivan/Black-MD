import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix }) => {
    let who;
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    } else {
        who = m.chat;
    }
    if (!who) throw `🚩 Por favor`, { react: { text: '👊🏻', key: m.key } });

    let str = `${name2} ha golpeado a ${name}`.trim();

    try {
        let response = await fetch(`https://api.waifu.pics/sfw/slap`);
        if (!response.ok) throw `❌ Error`, who] }, { quoted: m });
    } catch (error) {
        throw `❌ Ocurrió un error: ${error}`;
    }
};

handler.help = ['bofetada @tag'];
handler.tags = ['fun'];
handler.command = ['slap', 'bofetada'];
handler.group = true;

export default handler;