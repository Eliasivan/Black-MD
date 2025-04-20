//No funciona xd
import fetch from 'node-fetch';

const apiUrl = 'https://api.dorratz.com/v2/pix-ai';

const pixAiSearch = async (prompt) => {
  const url = `${apiUrl}?prompt=${encodeURIComponent(prompt)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });
  const data = await response.json();
  return data;
};

const handler = async (m, { text }) => {
  if (!text) return m.reply('Por favor, proporciona un prompt para generar la imagen.');
  try {
    const prompt = text.trim();
    const response = await pixAiSearch(prompt);
    const imageUrl = response.data[0].url;
    await m.reply(imageUrl);
  } catch (error) {
    console.error(error);
    m.reply('Error al generar la imagen.');
  }
};

handler.help = ['pixai'];
handler.tags = ['imagen'];
handler.command = ['pixai'];
handler.premium = false;

export default handler;