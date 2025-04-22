/* Codigo creado por ofcking y mejorado por Eliasivan */

import fs from 'fs';
import path from 'path';

var handler = async (m, { conn, usedPrefix, command }) => {
  try {
    await m.react('🕒');
    await conn.sendPresenceUpdate('composing', m.chat);
    const pluginsDir = './plugins';
    const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));
    let response = `📥 *Revisión de Syntax Errors:*\n\n`;
    let hasErrors = false;
    let deletedFiles = 0;
    for (const file of files) {
      try {
        await import(path.resolve(pluginsDir, file));
      } catch (error) {
        hasErrors = true;
        response += `🚩 *Error en:* ${file}\nParece que hay un error: ${error.message}\n\n`;
        console.error(`Error en ${file}: ${error.message}`);
        try {
          fs.unlinkSync(path.resolve(pluginsDir, file));
          response += `🗑️ *Eliminado:* ${file}\n\n`;
          deletedFiles++;
        } catch (deleteError) {
          response += `🚩 *No se pudo eliminar:* ${file}\n${deleteError.message}\n\n`;
          console.error(`No se pudo eliminar ${file}: ${deleteError.message}`);
        }
      }
    }
    if (hasErrors) {
      response += `🗑️ *Se eliminaron ${deletedFiles} archivos con errores.*\n\n`;
      response += '✅ *Ya no hay errores en los archivos de plugins restantes.*';
    } else {
      response += '✅ ¡Todo está en orden! No se detectaron errores de sintaxis.';
    }
    await conn.reply(m.chat, response, m);
    await m.react('✅');
  } catch (err) {
    await m.react('✖️');
    console.error(err);
    await conn.reply(m.chat, '🚩 *Ocurrió un fallo al verificar los plugins.*', m);
  }
};

handler.command = ['syntax'];
handler.help = ['syntax'];
handler.tags = ['tools'];
handler.register = true;
handler.rowner = true;

export default handler;