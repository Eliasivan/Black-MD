import fetch from 'node-fetch';
import yts from 'yt-search';

const handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply('Ingresa el link del YouTube o nombre para descargarlo');

  const text = args.join(' ');
  let url;

  if (text.includes('youtube.com') || text.includes('youtu.be')) {
    url = text;
  } else {
    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply('No se encontraron resultados para tu búsqueda.');
    }
    url = search.all[0].url;
  }

  try {
    m.react('⏳'); // Reacción de tiempo
    if (args[0].includes('audio')) {
      const api = await (await fetch(`https://api.sylphy.xyz/download/ytmp3?url=${url}&apikey=sylph`)).json();
      const title = api.result.title;

      const infoMessage = `*Información del audio:*\n\n*Título:* ${title}`;

      m.reply(infoMessage);

      conn.sendMessage(m.chat, { audio: { url: api.result.download_url }}, { mimetype: 'audio/mpeg' }, m);
      m.react('✅'); // Reacción de verificación
    } else if (args[0].includes('video')) {
      const api = await (await fetch(`https://api.sylphy.xyz/download/ytmp4?url=${url}&apikey=sylph`)).json();
      const title = api.result.title;

      const infoMessage = `*Información del video:*\n\n*Título:* ${title}`;

      m.reply(infoMessage);

      conn.sendMessage(m.chat, { video: { url: api.result.download_url }}, { mimetype: 'video/mp4' }, m);
      m.react('✅'); // Reacción de verificación
    } else {
      m.reply('Por favor, especifica si deseas descargar audio o video');
    }
  } catch (error) {
    console.error(error);
    m.react('❌'); // Reacción de error
    m.reply('Error al procesar la solicitud');
  }
};

handler.help = ['yt <url> <audio/video>'];
handler.tags = ['downloader'];
handler.command = ['yt'];

export default handler;