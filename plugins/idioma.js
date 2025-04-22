const handlerIdioma = async (m, { conn, text }) => {
  if (text === 'en') {
    // Importar archivo de idioma inglés
    import { mensajes } from './Lenguaje/en.js';
    await conn.reply(m.chat, mensajes.seleccionIdioma);
  } else if (text === 'es') {
    // Importar archivo de idioma español
    import { mensajes } from './Lenguaje/es.js';
    await conn.reply(m.chat, mensajes.seleccionIdioma);
  } else {
    await conn.reply(m.chat, 'Idioma no soportado');
  }
};

handlerIdioma.help = ['idioma'];
handlerIdioma.tags = ['idioma'];
handlerIdioma.command = ['idioma'];
handlerIdioma.group = true;

export default handlerIdioma;