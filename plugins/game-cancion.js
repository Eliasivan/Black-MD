import fetch from 'node-fetch';
import axios from 'axios';

const timeout = 30000; // Tiempo límite en milisegundos
const poin = 200; // Puntos de recompensa
let img = './src/menus/Menu2.jpg'; // Ruta de la imagen opcional

const handler = async (m, { conn, usedPrefix }) => {
  // Inicializamos la propiedad tebaklagu si no existe
  conn.tebaklagu = conn.tebaklagu || {};
  const id = m.chat;

  // Verificamos si ya hay un juego activo en el chat
  if (id in conn.tebaklagu) {
    await conn.reply(m.chat, 'Todavía hay canciones sin respuesta en este chat.', conn.tebaklagu[id][0]);
    return;
  }

  // Obtenemos datos de la API externa
  const res = await fetchJson(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/tebaklagu.json`);
  const json = res[Math.floor(Math.random() * res.length)];

  // Mensaje inicial del juego
  const caption = `
🎵 *ADIVINA EL TÍTULO DE LA CANCIÓN* 🎵
⏳ Tiempo: ${(timeout / 1000).toFixed(2)} segundos
💡 Escribe *${usedPrefix}pista* para obtener una pista.
🎁 Premio: ${poin} cookies 🍪
*RESPONDE A ESTE MENSAJE CON TU RESPUESTA!*`.trim();

  // Guardamos el estado del juego en el objeto conn.tebaklagu
  conn.tebaklagu[id] = [
    await conn.reply(m.chat, caption, m),
    json,
    poin,
    setTimeout(() => {
      if (conn.tebaklagu[id]) {
        conn.reply(m.chat, `⏱️ Se acabó el tiempo!\nLa respuesta correcta era: *${json.jawaban}*`, conn.tebaklagu[id][0]);
        delete conn.tebaklagu[id];
      }
    }, timeout),
  ];

  // Enviamos el audio de la canción
  try {
    const audioMessage = await conn.sendMessage(
      m.chat,
      { audio: { url: json.link_song }, fileName: `cancion.mp3`, mimetype: 'audio/mpeg' },
      { quoted: m }
    );

    if (!audioMessage) {
      // Reenviamos el archivo si falla
      await conn.sendFile(m.chat, json.link_song, 'cancion.mp3', '', m);
    }
  } catch (error) {
    console.error('Error al enviar el audio:', error);
    await conn.reply(m.chat, '❌ Ocurrió un error al intentar enviar el audio.', m);
  }

  // Mensaje adicional para usar pistas
  await conn.reply(m.chat, '💥 Usa el comando *#pista* si necesitas una pista.', m);
};

// Configuración del comando
handler.help = ['cancion'];
handler.tags = ['fun'];
handler.command = /^cancion|canción$/i; // Comando válido
handler.group = true; // Solo en grupos
handler.register = true; // Requiere registro

export default handler;

// Función para obtener datos JSON desde una URL
async function fetchJson(url, options) {
  try {
    options = options || {};
    const res = await axios({
      method: 'GET',
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
      },
      ...options
    });
    return res.data;
  } catch (err) {
    console.error('Error al obtener JSON:', err);
    throw err;
  }
}