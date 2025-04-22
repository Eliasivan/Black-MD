import en from './Lenguaje/en.js';
import es from './Lenguaje/es.js';

let idiomaActual = es.mensajes;

const handlerIdioma = async (m, { conn, text }) => {
  if (text === 'en') {
    idiomaActual = en.mensajes;
  } else if (text === 'es') {
    idiomaActual = es.mensajes;
  } else {
    await conn.reply(m.chat, 'Idioma no soportado');
    return;
  }
  await conn.reply(m.chat, idiomaActual.seleccionIdioma);
};

const handler = async (m, { conn }) => {
  const groupMetadata = await conn.groupMetadata(m.chat);
  const participantes = groupMetadata.participants;
  const ganador = participantes[Math.floor(Math.random() * participantes.length)];

  const suerte = Math.random();

  if (suerte < 0.5) {
    // Dar admin
    await conn.groupParticipantsUpdate(m.chat, [ganador.id], "promote");
    await conn.reply(m.chat, `🎉 *${idiomaActual.felicidades}*\n\n@${ganador.id.split('@')[0]}. ${idiomaActual.admin} 🤩`, m, { mentions: [ganador.id] });
  } else {
    // Eliminar
    await conn.groupParticipantsUpdate(m.chat, [ganador.id], "remove");
    await conn.reply(m.chat, `😞 *${idiomaActual.malaSuerte}*\n\n@${ganador.id.split('@')[0]}, ${idiomaActual.eliminado} 😔`, m, { mentions: [ganador.id] });
  }
};

handlerIdioma.help = ['idioma'];
handlerIdioma.tags = ['idioma'];
handlerIdioma.command = ['idioma'];
handlerIdioma.group = true;

handler.help = ['sorteo'];
handler.tags = ['group'];
handler.command = ['sorteo'];
handler.group = true;
handler.admin = true;

export { handlerIdioma, handler };