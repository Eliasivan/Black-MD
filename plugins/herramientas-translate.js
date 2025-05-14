import translate from '@vitalets/google-translate-api';
import fetch from 'node-fetch';

const handler = async (m, { args, usedPrefix, command }) => {
  const msg = `👑 *Uso correcto del comando ${usedPrefix + command} (idioma) (texto)*\n*Ejemplo:*\n*${usedPrefix + command} es Hello*\n\n*Conoce los idiomas admitidos en:*\n*- https://cloud.google.com/translate/docs/languages*`;
  if (!args || !args[0]) return m.reply(msg);

  let lang = args[0];
  let text = args.slice(1).join(' ');
  const defaultLang = 'es';

  // Establecer idioma por defecto si no se proporciona un código válido
  if ((args[0] || '').length !== 2) {
    lang = defaultLang;
    text = args.join(' ');
  }

  // Si no hay texto explícito, intentar usar texto citado
  if (!text && m.quoted && m.quoted.text) text = m.quoted.text;

  try {
    // Intentar traducir con la primera API
    const result = await translate(`${text}`, { to: lang, autoCorrect: true });
    await m.reply('*Traducción:* ' + result.text);
  } catch {
    try {
      // Intentar traducir con API alternativa si falla la primera
      const lol = await fetch(`https://api.lolhuman.xyz/api/translate/auto/${lang}?apikey=${lolkeysapi}&text=${text}`);
      const loll = await lol.json();
      const result2 = loll.result.translated;
      await m.reply('*Traducción:* ' + result2);
    } catch {
      // Manejo de errores genérico
      await m.reply('✨️ *Ocurrió un error al traducir el texto.*');
    }
  }
};

handler.command = ['translate', 'traducir', 'trad'];
handler.group = true;
handler.register = true;
export default handler;