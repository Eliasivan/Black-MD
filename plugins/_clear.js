// Credits: OfcKing
// >> https://github.com/OfcKing
import fetch from 'node-fetch';

const pinterest = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, `Ingresa el texto de lo que quieres buscar en Pinterest`, m);

  try {
    const api = `https://bk9.fun/pinterest/search?q=${text}`;
    const response = await fetch(api);
    const data = await response.json();

    if (!data || !data.BK9 || !data.BK9.length) return conn.reply(m.chat, `No se encontraron resultados para ${text}.`, m);

    const randomRes = data.BK9[Math.floor(Math.random() * data.BK9.length)];
    const caption = `- *Titulo :* ${randomRes.grid_title || '-'}`;

    await conn.sendMessage(m.chat, { image: { url: randomRes.images_url }, caption: caption }, { quoted: m });
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `Error al buscar en Pinterest`, m);
  }
};

pinterest.command = ['pinterest1'];
export default pinterest;