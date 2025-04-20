import { default as makeWASocket, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import fetch from 'node-fetch';

const conn = makeWASocket({
  // Configuración de Baileys
  auth: {
    creds: {
      // Tus credenciales de WhatsApp
    }
  }
});

let handler = async (m, { usedPrefix, command, text }) => {
  if (!text) return conn.sendMessage(m.chat, { text: `⚠️ Por favor, proporciona el texto o adjunta una imagen/video para subir como estado` });

  if (m.quoted && m.quoted.mimetype.startsWith('image/')) {
    // Subir imagen como estado
    let buffer = await (await fetch(m.quoted.url)).buffer();
    await conn.sendMessage(m.chat, { status: { jpegThumbnail: buffer } });
    await conn.sendMessage(m.chat, { react: { key: m.key, text: '✅' } });
  } else if (m.quoted && m.quoted.mimetype.startsWith('video/')) {
    // Subir vídeo como estado
    let buffer = await (await fetch(m.quoted.url)).buffer();
    await conn.sendMessage(m.chat, { status: { video: buffer } });
    await conn.sendMessage(m.chat, { react: { key: m.key, text: '✅' } });
  } else {
    // Subir texto como estado
    await conn.sendMessage(m.chat, { status: { text } });
    await conn.sendMessage(m.chat, { react: { key: m.key, text: '✅' } });
  }
};

handler.help = ['subirestado'];
handler.tags = ['whatsapp'];
handler.command = ['subirestado'];

export default handler;