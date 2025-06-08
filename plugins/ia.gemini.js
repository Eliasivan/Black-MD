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

        if (/creadores grandes de bot/i.test(text)) {
            const responseMessage = `≡ *Grandes de los bots en aquella época:* 
┌──────────────
▢ Ender Lobo-Bot-MD
▢ Jostin Goku-Bot-MD
▢ Axx Baileys-Bot-MD
▢ Enzo Diabla-Bot-MD
└──────────────`;
            await conn.reply(m.chat, responseMessage, m);
            await m.react('✅️');
            return;
        }

        if (/quién es tu creador/i.test(text)) {
            const responseMessage = `✨ Mi creador es Ivan`;
            await conn.reply(m.chat, responseMessage, m);
            await m.react('✅️');
            return;
        }

        var apii = await fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${text}`);
        var res = await apii.json();

        const responseMessage = `✨ *Creador*: Ivan\n\n${res.result}`;
        await conn.reply(m.chat, responseMessage, m);
        await m.react('✅️');
    } catch (error) {
        return conn.reply(m.chat, 'Enseñame que responder.', m);
    }
};

handler.command = ['gemini'];
handler.help = ['gemini'];
handler.tags = ['ai'];
export default handler;