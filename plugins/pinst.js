import axios from 'axios';

const pinterest = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, ingresa un texto para buscar en Pinterest');

  const apiKey = 'fg_STZFglNn';
  const url = `https://api.fgmods.xyz/api/search/pinterest?text=${encodeURIComponent(text)}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data && data.length > 0) {
      const images = [];
      data.forEach((image) => {
        images.push(image);
      });
      const randomImage = images[Math.floor(Math.random() * images.length)];
      conn.sendFile(m.chat, randomImage, 'pinterest.jpg', `Resultado de búsqueda en Pinterest para "${text}"`);
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
pinterest.group = true;

export default pinterest;