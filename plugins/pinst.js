import axios from 'axios';

const pinterest = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, ingresa un texto para buscar en Pinterest');

  const url = `https://api.fgmods.xyz/api/search/pinterest?text=${encodeURIComponent(text)}&apikey=fg_STZFglNn`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data && data.length > 0) {
      for (const image of data.slice(0, 5)) {
        await conn.sendFile(m.chat, image, 'pinterest.jpg', '');
      }
    } else {
      conn.reply(m.chat, 'No se encontraron resultados');
    }
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `Error al buscar en Pinterest: ${error.message}`);
  }
};

pinterest.help = ['pinterest'];
pinterest.tags = ['search'];
pinterest.command = ['pind'];

export default pinterest;