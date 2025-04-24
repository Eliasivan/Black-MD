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

  const videoInfo = await yts(url);
  const { title, thumbnail, timestamp, views, ago } = videoInfo.videos[0];

  const infoMessage = `*Información del audio:*\n\n*Título:* ${title}\n*Duración:* ${timestamp}\n*Vistas:* ${views}\n*Publicado:* ${ago}`;

  m.reply(infoMessage);

  try {
    m.react('⏳'); // Reacción de tiempo
    const api = await (await fetch(`https://api.sylphy.xyz/download/ytmp3?url=${url}&apikey=sylph`)).json();
    conn.sendMessage(m.chat, { audio: { url: api.result.download_url }}, { mimetype: 'audio/mpeg' }, m);
    m.react('✅'); // Reacción de verificación
  } catch (error) {
    console.error(error);
    m.react('❌'); // Reacción de error
    m.reply('Error al procesar la solicitud');
  }
};

handler.help = ['ytmp3 <url>'];
handler.tags = ['downloader'];
handler.command = ['ytmp3', 'yta'];

export default handler;