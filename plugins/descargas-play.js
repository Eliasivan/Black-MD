import axios from 'axios';

const handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      await conn.sendMessage(m.chat, { text: '🚩 Por favor proporciona el ID de la aplicación en la Play Store (ejemplo: com.duolingo).' }, { quoted: m });
      return;
    }

    const response = await axios.get(`https://api.siputzx.my.id/api/apk/direct?package=${text}`);
    const data = response.data;

    if (!data || !data.dllink) {
      await conn.sendMessage(m.chat, { text: `❌ No se pudo obtener el enlace de descarga para "${text}".` }, { quoted: m });
      return;
    }

    await m.react('🕓');

    const downloadLink = data.dllink;
    await conn.sendMessage(m.chat, { text: `Descargando aplicación...\nEnlace de descarga: ${downloadLink}` }, { quoted: m });

    // Enviar el archivo APK
    await conn.sendMessage(m.chat, { document: { url: downloadLink }, mimetype: 'application/vnd.android.package-archive', fileName: `${text}.apk` }, { quoted: m });

    await m.react('✅');
  } catch (error) {
    await m.react('✖️');
    console.error('Error al obtener el enlace de descarga:', error);
    await conn.sendMessage(m.chat, { text: '❌ Ocurrió un error al intentar obtener el enlace de descarga. Inténtalo nuevamente.' }, { quoted: m });
  }
};

handler.help = ['descargarapk <id>'];
handler.tags = ['apk'];
handler.register = true;
handler.command = /^(descargarapk|apkdl)$/i;
export default handler;