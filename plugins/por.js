/* Codigo creado por Rayo-ofc dejar creditos
*/

import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `Por favor, ingresa el texto que deseas procesar.\n\nEjemplo: ${usedPrefix}${command} GokuBlack`, m);
  }

  let apiUrl;
  switch (command) {
    case "alert":
      apiUrl = `https://api.popcat.xyz/v2/alert?text=${encodeURIComponent(text)}`;
      break;
    case "caution":
      apiUrl = `https://api.popcat.xyz/v2/caution?text=${encodeURIComponent(text)}`;
      break;
    case "facts":
      apiUrl = `https://api.popcat.xyz/v2/facts?text=${encodeURIComponent(text)}`;
      break;
    default:
      return conn.reply(m.chat, `Comando no reconocido. Usa .alert, .caution o .facts seguido de tu texto.`, m);
  }

  try {
    let res = await fetch(apiUrl);
    let data = await res.text();

    if (!res.ok) {
      return conn.reply(m.chat, `Hubo un problema al conectar con la API. Código de estado: ${res.status}\n\nRespuesta: ${data}`, m);
    }

    try {
      data = JSON.parse(data);
    } catch (error) {
      if (data.startsWith("�PNG")) {
        return conn.sendFile(m.chat, apiUrl, 'image.png', '', m);
      } else {
        return conn.reply(m.chat, `No se pudo obtener una respuesta válida de la API.\n\nRespuesta: ${data}`, m);
      }
    }

    if (!data || !data.message) {
      return conn.reply(m.chat, `No se pudo obtener una respuesta válida de la API.\n\nRespuesta: ${data}`, m);
    }

    await conn.reply(m.chat, `✨ Resultado:\n${data.message}`, m);
  } catch (error) {
    return conn.reply(m.chat, `❌ Ocurrió un error: ${error.message}`, m);
  }
};

handler.help = ['alert <texto>', 'caution <texto>', 'facts <texto>'];
handler.tags = ['tools'];
handler.command = ['alert', 'caution', 'facts'];

export default handler;