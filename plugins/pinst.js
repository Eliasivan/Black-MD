import axios from 'axios';

const pinterest = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, ingresa un texto para buscar en Pinterest');

  const apiKey = 'fg_STZFglNn';
  const url = `https://api.fgmods.xyz/api/search/pinterest?text=${encodeURIComponent(text)}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.result && data.result.length > 0) {
      const results = data.result;
      const mensaje = `Resultados de búsqueda en Pinterest para "${text}":\n\n`;
      results.forEach((result, index) => {
        mensaje += `${index + 1}. ${result.title}\n${result.url || result.images[0].url}\n\n`;
      });
      conn.reply(m.chat, mensaje);
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