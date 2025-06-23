import yts from "yt-search";
import { yta } from "./lib/ytdll.js";

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply("🌴 Ingresa el nombre de un video o una URL de YouTube.");
  m.react("🌱");

  let res = await yts(text);
  if (!res || !res.all || res.all.length === 0) {
    return m.reply("No se encontraron resultados para tu búsqueda.");
  }

  let video = res.all[0];
  const cap = `
\`\`\`⊜─⌈ 📻 ◜YouTube MP3◞ 📻 ⌋─⊜\`\`\`

≡ 🌿 \`Título\` : » ${video.title}
≡ 🌾 \`Autor\`  : » ${video.author.name}
≡ 🌱 \`Duración\` : » ${video.duration.timestamp}
≡ 🌴 \`Vistas\` : » ${video.views}
≡ ☘️ \`URL\`      : » ${video.url}
`;

  await conn.sendFile(m.chat, await (await fetch(video.thumbnail)).buffer(), "image.jpg", cap, m);

  try {
    const api = await yta(video.url);
    await conn.sendFile(
      m.chat,
      api.result.download,
      api.result.title + ".mp3",
      "",
      m,
      null,
      { mimetype: "audio/mp3" }
    );
    await m.react("✔️");
  } catch (error) {
    return m.reply("Ocurrió un error al descargar el audio.");
  }
};

handler.help = ["mp11"];
handler.tags = ["download"];
handler.command = ["mp11"];
export default handler;