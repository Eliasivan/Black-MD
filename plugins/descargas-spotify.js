import yts from "yt-search";
import fetch from "node-fetch";
import { ogmp3 } from "../lib/uploadAudio.js";

const SIZE_LIMIT_MB = 100;

const handler = async (m, { conn, text, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `> Escribe el nombre de una canción`,
      m
    );
  }

  await m.react("☄");

  try {
    const search = await yts(text);
    if (!search?.all || search.all.length === 0) {
      return conn.reply(m.chat, `> No se encontraron resultados para: "${text}"`, m);
    }

    const video = search.all[0];

    const caption = `
• 🎧 `Título:` ${video.title}
• ⏱️ `Duración:` ${video.duration.timestamp}
• 👁️ `Vistas:` ${video.views.toLocaleString()}
• 👤 `Autor:` ${video.author.name}
• 🔗 `Enlace:` ${video.url}
> SIGUENOS EN NUESTRAS REDES O CANAL OFICIAL DEL BOT`.trim();

    await conn.sendMessage(
      m.chat,
      {
        image: { url: video.thumbnail },
        caption
      },
      { quoted: m }
    );

    if (command === "play") {
      const res = await ogmp3.download(video.url, "320", "audio");

      if (!res.status) {
        return conn.reply(m.chat, `❌ No se pudo descargar el audio.`, m);
      }

      await conn.sendMessage(
        m.chat,
        {
          audio: { url: res.result.download },
          mimetype: "audio/mpeg",
          fileName: res.result.title + ".mp3",
          ptt: true
        },
        { quoted: m }
      );

      await m.react("🎶");

    } else if (command === "play2" || command === "playvid") {
      const apiBase = "https://api.vreden.my.id/api";
      const resVideo = await fetch(`${apiBase}/ytmp4?url=${encodeURIComponent(video.url)}`);
      const json = await resVideo.json();

      if (!json.status || !json.data?.dl) {
        return conn.reply(m.chat, `❌ No se pudo obtener el video.`, m);
      }

      const head = await fetch(json.data.dl, { method: "HEAD" });
      const sizeMB = parseInt(head.headers.get("content-length") || "0") / (1024 * 1024);
      const asDocument = sizeMB > SIZE_LIMIT_MB;

      await conn.sendMessage(
        m.chat,
        {
          video: { url: json.data.dl },
          caption: `🎥 Aquí tienes tu video.`,
          fileName: json.data.title + ".mp4",
          mimetype: "video/mp4"
        },
        {
          quoted: m,
          ...(asDocument ? { asDocument: true } : {})
        }
      );

      await m.react("📽️");
    }
  } catch (e) {
    return conn.reply(m.chat, `❌ Error inesperado:\n${e.message}`, m);
  }
};

handler.help = ["play", "play2", "playvid"];
handler.tags = ["descargas"];
handler.command = ["play"];
handler.register = true;
handler.money = 20;

export default handler;
