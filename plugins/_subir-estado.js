import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return conn.reply(m.chat, `⚠️ Por favor, proporciona el texto o adjunta una imagen/video para subir como estado`, m);

  if (m.quoted && m.quoted.mimetype.startsWith('image/')) {
    // Subir imagen como estado
    let buffer = await (await fetch(m.quoted.url)).buffer();
    await conn.sendMessage(m.chat, { status: { jpegThumbnail: buffer } });
    await m.react('✅');
  } else if (m.quoted && m.quoted.mimetype.startsWith('video/')) {
    // Subir vídeo como estado
    let buffer = await (await fetch(m.quoted.url)).buffer();
    await conn.sendMessage(m.chat, { status: { video: buffer } });
    await m.react('✅');
  } else {
    // Subir texto como estado
    await conn.sendMessage(m.chat, { status: { text } });
    await m.react('✅');
  }
};

handler.help = ['sirestado'];
handler.tags = ['whatsapp'];
handler.command = ['sirestado'];

export default handler;