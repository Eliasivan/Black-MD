import axios from 'axios';

const handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      await conn.sendMessage(m.chat, { text: '🚩 Por favor proporciona un término de búsqueda.' }, { quoted: m });
      return;
    }

    const response = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(text)}`);
    const data = response.data.data;

    if (data.length === 0) {
      await conn.sendMessage(m.chat, { text: `❌ No se encontraron imágenes para "${text}".` }, { quoted: m });
      return;
    }

    await m.react('🕓');

    for (let i = 0; i < 5 && i < data.length; i++) {
      const randomImage = data[i];
      const imageUrl = randomImage.images_url;
      await conn.sendMessage(m.chat, { image: { url: imageUrl } }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { text: `𝐄𝐒𝐓𝐎𝐒 𝐅𝐔𝐄 𝐄𝐍𝐂𝐎𝐍𝐓𝐑𝐀𝐃𝐎 𝐃𝐄 ${text} ✰` }, { quoted: m });
    await m.react('✅');
  } catch (error) {
    await m.react('✖️');
    console.error('Error al obtener la imagen:', error);
    await conn.sendMessage(m.chat, { text: '❌ Ocurrió un error al intentar obtener la imagen. Inténtalo nuevamente.' }, { quoted: m });
  }
};

handler.help = ['pinterest <término>'];
handler.tags = ['img'];
handler.register = true;
handler.command = /^(pinterest|pinterestsearch)$/i;
export default handler;