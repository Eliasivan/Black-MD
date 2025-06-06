let handler = async (m, { args, text, command, conn }) => {
    if (!args[0]) {
        return m.reply(`💨 ¡Hola! Para reaccionar a un mensaje, usa el siguiente formato:\n${command} https://whatsapp.com/channel/... ¡Hola, amigos! 🎉`);
    }

    if (!args[0].startsWith("https://whatsapp.com/channel/")) {
        return m.reply("❌ Ups! No es un enlace válido. Asegúrate de que empieza con https://whatsapp.com/channel/.");
    }

    const hurufGaya = {
        a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
        h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
        o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
        v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
        '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
        '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
    };

    const emojiInput = args.slice(1).join(' ').toLowerCase();
    const emoji = emojiInput.split('').map(c => {
        return c === '' ? "•" : (hurufGaya[c] || c);
    }).join('');

    try {
        const link = args[0];
        const channelId = link.split('/')[4];
        const messageId = link.split('/')[5];

        const res = await conn.newsletterMetadata("invite", channelId);
        await conn.newsletterReactMessage(res.id, messageId, emoji);

        return m.reply(`🎉 ¡Felicidades! Se envió la reacción *${emoji}* al mensaje en el canal *${res.name}*. ¡Que comience la fiesta! 🥳`);
    } catch (e) {
        console.error(e);
        return m.reply("🚫 Oh no... No se pudo enviar la reacción. Verifica que el enlace y el texto sean válidos. ¡Vamos a intentarlo de nuevo! 🤞");
    }
};

handler.help = handler.command = ["rc"];
handler.tags = ["tools"];
export default handler;