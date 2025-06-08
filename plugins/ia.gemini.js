import fetch from 'node-fetch';

var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            `✨ *Ingresé una petición*\n\nEjemplo: ${usedPrefix + command} hola, conoces a Goku-Black-Bot-MD?`,
            m
        );
    }
    try {
        await m.react('🕒');
        conn.sendPresenceUpdate('composing', m.chat);

        var apii.app/starlight/gemini?text=${text}`);
        var res = await apii.json();

        const responseMessage = `✨ *Creador*: Ivan\n\n${res.result}\n\n≡ *Grandes de los bots en aquella época:* 
┌──────────────
▢ Ender Lobo-Bot-MD
▢ Jostin Goku-Bot-MD
▢ Axx Baileys-Bot-MD
▢ Enzo Diabla-Bot-MD
└──────────────`;

        await conn);
        await m.react('✅️');
    } catch (error) {
        return conn.reply(m.chat, 'Enseñame que responder.', m);
    }
};

handler.command = ['gemini'];
handler.help = ['gemini'];
handler.tags = ['ai'];
export default handler;