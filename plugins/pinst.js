const axios = require('axios');

const pinterestSearch = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, ingresa un texto para buscar en Pinterest');

  const apiKey = 'fg_STZFglNn';
  const url = `https://api.fgmods.xyz/api/search/pinterest?text=${text}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status) {
      const results = data.result;
      const mensaje = `Resultados de búsqueda en Pinterest para "${text}":\n\n`;
      results.forEach((result, index) => {
        mensaje += `${index + 1}. ${result.title}\n${result.url}\n\n`;
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

pinterestSearch.help = ['pinterest'];
pinterestSearch.tags = ['search'];
pinterestSearch.command = ['pinterest6'];
pinterestSearch.group = true;

export default pinterestSearch;