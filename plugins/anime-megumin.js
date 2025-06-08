import fetch from 'node-fetch';

var handler = async (m, { usedPrefix, command }) => {
    try {
        await m.react('🕒');
        conn.sendPresenceUpdate('composing', m.chat);
        
        let res = await fetch('https://api.waifu.pics/sfw/megumin');
        let data = await res.json();
        
        if (!data || !data.url) {
            await m.react('❌');
            return conn.reply(m.chat, 'No se pudo obtener la imagen. Intenta nuevamente más tarde.', m);
        }
        
        await conn.sendFile(m.chat, data.url, 'megumin.jpg', '✨ Aquí tienes una imagen de Megumin', m);
        await m.react('✅️');
    } catch (error) {
        await m.react('❌');
        return conn.reply(m.chat, `❌ Ocurrió un error: ${error.message}`, m);
    }
};

handler.command = ['megumin'];
handler.help = ['megumin'];
handler.tags = ['anime'];
export default handler;