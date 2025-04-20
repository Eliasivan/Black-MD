import fetch from 'node-fetch';

const apiUrl = 'https://api.dorratz.com/v2/tiktok-dl';

const tiktokDownloader = async (url) => {
  try {
    const params = new URLSearchParams({
      url: url,
    });
    const response = await fetch(`${apiUrl}?${params}`);
    const data = await response.json();
    if (data.status) {
      return data;
    } else {
      throw new Error('Error al descargar el video.');
    }
  } catch (error) {
    throw error;
  }
};

const handler = async (m, { text }) => {
  try {
    if (!text) return m.reply('Por favor, proporciona la URL del video de TikTok.');
    const url = text.trim();
    const response = await tiktokDownloader(url);
    const videoUrl = response.data.play;
    await m.reply(videoUrl);
  } catch (error) {
    console.error(error);
    m.reply('Error al descargar el video.');
  }
};

handler.help = ['tiktokdl'];
handler.tags = ['descargar'];
handler.command = ['tikdl'];
handler.premium = false;

export default handler;