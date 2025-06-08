let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
        let name = await conn.getName(who);

        const pp = './src/Menus/Menu2.jpg';

        let percentage = [`10%`, `20%`, `30%`, `40%`, `50%`, `60%`, `70%`, `80%`, `90%`, `100%`].sort(() => Math.random() - 0.5)[0];
        let textResponse = [`Jajja Pornub💋`, `Muy Pajero 💋`, `Pajerooo 💋`, `Parese Gay Pajeandote 💋`, `Un pornub jaj 💋`, `Se pajea 💋`].sort(() => Math.random() - 0.5)[0];

        let response = `*${name}* *es un ${percentage} de pajero*\n\n> Texto: ${textResponse}`, m, rcanal);

        conn.sendMessage(m.chat, { text: response, mentions: [m.sender] }, { quoted: m });
    } catch (e) {
        conn.reply(m.chat, `❌️ Ocurrió un error. Intente más tarde.`, m);
    }
};

handler.help = ['pornohub'];
handler.tags = ['+18'];
handler.command = ['pornohub', 'porn'];
export default handler;