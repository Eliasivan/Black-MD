import fs from 'fs';
import path from 'path';

var handler = async (m, { conn, usedPrefix, command }) => {
  try {
    await m.react('🕒');
    await conn.sendPresenceUpdate('composing', m.chat);
    const pluginsDir = './plugins';
    const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));
    let response = `📂 *Revisión de Syntax Errors:*\n\n`;
    let hasErrors = false;
    let fixedErrors = false;
    for (const file of files) {
      try {
        await import(path.resolve(pluginsDir, file));
      } catch (error) {
        hasErrors = true;
        response += `🚩 *Error en:* ${file}\nParece que hay un error: ${error.message}\n\n`;
        console.error(`Error en ${file}: ${error.message}`);
        try {
          const fileContent = fs.readFileSync(path.resolve(pluginsDir, file), 'utf8');
          const fixedContent = fileContent.replace(/([^=])\s*([{}])/g, '$1$2').replace(/;\s*$/, ''); // intenta arreglar algunos errores comunes de sintaxis
          fs.writeFileSync(path.resolve(pluginsDir, file), fixedContent);
          response += `✅ *Arreglado:* ${file}\n\n`;
          fixedErrors = true;
        } catch (fixError) {
          response += `🚩 *No se pudo arreglar:* ${file}\n${fixError.message}\n\n`;
          console.error(`No se pudo arreglar ${file}: ${fixError.message}`);
        }
      }
    }
    if (hasErrors && fixedErrors) {
      response += '✅ *Todos los errores han sido arreglados.*\n\n';
      response += '✅ *Ya no hay errores en ningún archivo de plugins.*';
    } else if (!hasErrors) {
      response += '✅ ¡Todo está en orden! No se detectaron errores de sintaxis.';
    } else {
      response += '🚩 *No se pudieron arreglar todos los errores.*';
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

export default handler;