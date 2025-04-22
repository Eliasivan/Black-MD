import en from './Lenguaje/en.js';
import es from './Lenguaje/es.js';

const handlerIdioma = async (m, { conn, text }) => {
  let mensajes;
  if (text === 'en') {
    mensajes = en.mensajes;
  } else if (text === 'es') {
    mensajes = es.mensajes;
  } else {
    await conn.reply(m.chat, 'Idioma no soportado');
    return;
  }
  await conn.reply(m.chat, mensajes.seleccionIdioma);
};

handlerIdioma.help = ['idioma'];
handlerIdioma.tags = ['idioma'];
handlerIdioma.command = ['idioma'];
handlerIdioma.group = true;

export default handlerIdioma;