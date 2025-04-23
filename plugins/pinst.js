import axios from 'axios';

const pinterest = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, ingresa un texto para buscar en Pinterest');

  const apiKey = 'fg_STZFglNn';
  const url = `https://api.fgmods.xyz/api/search/pinterest?text=${encodeURIComponent(text)}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data && data.length > 0) {
      for (const image of data) {
        await conn.sendFile(m.chat, image, 'pinterest.jpg', '');
      }
    } else {
      conn.reply(m.chat, 'No se encontraron resultados');
    }
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, 'Error al buscar en Pinterest');
  }
};

pinterest.help = ['pinterest'];
pinterest.tags = ['search'];
pinterest.command = ['pinterest6'];

export default pinterest;