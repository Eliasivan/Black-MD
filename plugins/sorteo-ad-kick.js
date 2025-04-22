import { mensajes } from './Lenguaje/en.js';

const handler = async (m, { conn }) => {
  const groupMetadata = await conn.groupMetadata(m.chat);
  const participantes = groupMetadata.participants;
  const ganador = participantes[Math.floor(Math.random() * participantes.length)];

  const suerte = Math.random();

  if (suerte < 0.5) {
    // Dar admin
    await conn.groupParticipantsUpdate(m.chat, [ganador.id], "promote");
    await conn.reply(m.chat, `🎉 *${mensajes.felicidades}*\n\n@${ganador.id.split('@')[0]}. ${mensajes.admin} 🤩`, m, { mentions: [ganador.id] });
  } else {
    // Eliminar
    await conn.groupParticipantsUpdate(m.chat, [ganador.id], "remove");
    await conn.reply(m.chat, `😞 *${mensajes.malaSuerte}*\n\n@${ganador.id.split('@')[0]}, ${mensajes.eliminado} 😔`, m, { mentions: [ganador.id] });
  }
};

handler.help = ['sorteo'];
handler.tags = ['group'];
handler.command = ['sorteo'];
handler.group = true;
handler.admin = true;

export default handler;