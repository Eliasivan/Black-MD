import axios from 'axios';
import { URL } from 'url';

const handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply('Por favor, proporciona una URL de YouTube válida');

  const url = args[0];
  const apikey = 'sylph'; // Reemplaza con tu propia API key si es necesario
  const apiUrl = `https://api.sylphy.xyz/download/ytmp3?url=${encodeURIComponent(url)}&apikey=${apikey}`;

  try {
    m.react('⏳'); // Reacción de tiempo
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status) {
      const audioUrl = data.result.download_url;
      const audioTitle = data.result.title;

      m.reply(`Descargando audio... ${audioTitle}`);
      await conn.sendFile(m.chat, audioUrl, audioTitle + '.mp3', '', m);
      m.react('✅'); // Reacción de verificación
      m.reply('Audio descargado y enviado con éxito!');
    } else {
      m.react('❌'); // Reacción de error
      m.reply('Error al descargar el audio');
    }
  } catch (error) {
    console.error(error);
    m.react('❌'); // Reacción de error
    m.reply('Error al procesar la solicitud');
  }
};

handler.help = ['ytmp3 <url>'];
handler.tags = ['downloader'];
handler.command = ['ytmp3', 'yta3'];

export default handler;