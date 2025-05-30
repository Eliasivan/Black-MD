import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
    const mensaje = "Estoy activo ✅";

    if (text.toLowerCase() === "activo" || text.toLowerCase() === "p") {
        await conn.sendMessage(m.chat, { 
            text: mensaje,
            contextInfo: {
                thumbnailUrl: 'https://files.catbox.moe/0ous50.jpg',
                newsletterJid: '12345@s.whatsapp.net',
                newsletterName: 'Goku-Black-Bot-MD',
            }
        });
        await m.react('👍🏻');
    }
};

handler.tags = ['info'];
handler.command = /^activo|p$/i;

export default handler;