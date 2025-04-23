import axios from 'axios';

const pinterest = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, ingresa un texto para buscar en Pinterest');

  const url = `https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(text)}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${encodeURIComponent(text)}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data && data.resource_response.data.results.length > 0) {
      const images = data.resource_response.data.results.map(image => image.images.orig.url);

      for (const image of images.slice(0, 5)) {
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
pinterest.command = ['pinterest'];
pinterest.group = true;

export default pinterest;