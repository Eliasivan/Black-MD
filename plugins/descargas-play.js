import axios from 'axios';

const handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      await conn.sendMessage(m.chat, { text: '🚩 Por favor proporciona una pregunta o contenido.' }, { quoted: m });
      return;
    }

    const response = await axios.get(`https://api.siputzx.my.id/api/ai/meta-llama-33-70B-instruct-turbo?content=${encodeURIComponent(text)}`);
    const respuesta = response.data;

    await conn.sendMessage(m.chat, { text: respuesta }, { quoted: m });
  } catch (error) {
    console.error('Error al obtener la respuesta:', error);
    await conn.sendMessage(m.chat, { text: '❌ Ocurrió un error al intentar obtener la respuesta. Inténtalo nuevamente.' }, { quoted: m });
  }
};

handler.help = ['ia <pregunta>'];
handler.tags = ['ai'];
handler.command = /^(ia|meta)$/i;
export default handler;