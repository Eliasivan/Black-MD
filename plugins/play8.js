import fetch from "node-fetch";
import yts from "yt-search";
const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(
        m.chat,
        `Por favor, ingresa el nombre de la música o el enlace del video para descargar el audio.`,
        m
      );
    }

    let videoIdToFind = text.match(youtubeRegexID) || null;
    let ytplay2 = await yts(videoIdToFind === null ? text : "https://youtu.be/" + videoIdToFind[1]);

    if (videoIdToFind) {
      const videoId = videoIdToFind[1];
      ytplay2 = ytplay2.all.find((item) => item.videoId === videoId) || ytplay2.videos.find((item) => item.videoId === videoId);
    }
    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2;

    if (!ytplay2 || ytplay2.length === 0) {
      return m.reply("✧ No se encontraron resultados para tu búsqueda.");
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = ytplay2;
    title = title || "No encontrado";
    thumbnail = thumbnail || "No encontrado";
    timestamp = timestamp || "No encontrado";
    views = views || "No encontrado";
    ago = ago || "No encontrado";
    url = url || "No encontrado";
    author = author || "No encontrado";

    const vistas = formatViews(views);
    const canal = author.name ? author.name : "Desconocido";
    const infoMessage = `「✦」Descargando *<${title || "Desconocido"}>*\n\n> ✧ Canal » *${canal}*\n> ✰ Vistas » *${vistas || "Desconocido"}*\n> ⴵ Duración » *${timestamp || "Desconocido"}*\n> ✐ Publicado » *${ago || "Desconocido"}*\n> 🜸 Link » ${url}`;
    const thumb = (await conn.getFile(thumbnail))?.data;
    const JT = {
      contextInfo: {
        externalAdReply: {
          title: "Descargar Audio",
          body: "Procesando tu audio...",
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    };
    await conn.reply(m.chat, infoMessage, m, JT);

    try {
      const apiUrl = `https://api.neoxr.eu/api/youtube?url=${url}&type=audio&quality=128kbps&apikey=russellxz`;
      const apiResponse = await fetch(apiUrl);
      const apiData = await apiResponse.json();

      if (!apiData || apiData.status !== true || !apiData.data || !apiData.data.url) {
        throw new Error("⚠ El enlace de audio no se generó correctamente.");
      }

      const { url: audioUrl, title: audioTitle } = apiData.data;

      await conn.sendMessage(
        m.chat,
        { audio: { url: audioUrl }, fileName: `${audioTitle}.mp3`, mimetype: "audio/mpeg" },
        { quoted: m }
      );
    } catch (e) {
      return conn.reply(
        m.chat,
        "⚠︎ No se pudo enviar el audio. Esto puede deberse a que el archivo es demasiado pesado o a un error en la generación de la URL. Por favor, intenta nuevamente más tarde.",
        m
      );
    }
  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error.message}`);
  }
};

handler.command = handler.help = ["play"];
handler.tags = ["descargas"];

export default handler;

function formatViews(views) {
  if (views === undefined) {
    return "No disponible";
  }

  if (views >= 1_000_000_000) {
    return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`;
  } else if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`;
  } else if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`;
  }
  return views.toString();
}