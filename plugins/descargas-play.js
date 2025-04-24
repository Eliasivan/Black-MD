//no funcionó xd
import axios from 'axios';

const handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      await conn.sendMessage(m.chat, { text: '🚩 Por favor proporciona un término de búsqueda.' }, { quoted: m });
      return;
    }

    const response = await axios.get(`https://api.siputzx.my.id/api/apk/playstore?query=${encodeURIComponent(text)}`);
    const data = response.data;

    if (!data || data.length === 0) {
      await conn.sendMessage(m.chat, { text: `❌ No se encontraron resultados para "${text}".` }, { quoted: m });
      return;
    }

    await m.react('🕓');

    const message = `Resultados de búsqueda para "${text}":\n\n`;
    data.forEach((app, index) => {
      message += `${index + 1}. ${app.name}\n`;
      message += `   - Desarrollador: ${app.developer}\n`;
      message += `   - Descargas: ${app.downloads}\n`;
      message += `   - Enlace: ${app.url}\n\n`;
    });

    await conn.sendMessage(m.chat, { text: message }, { quoted: m });
    await m.react('✅');
  } catch (error) {
    await m.react('✖️');
    console.error('Error al obtener los datos:', error);
    await conn.sendMessage(m.chat, { text: '❌ Ocurrió un error al intentar obtener los datos. Inténtalo nuevamente.' }, { quoted: m });
  }
};

handler.help = ['playstore <término>'];
handler.tags = ['apk'];
handler.register = true;
handler.command = /^(playstore|apksearch)$/i;
export default handler;