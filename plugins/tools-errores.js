import fs from 'fs';
import path from 'path';

var handler = async (m, { usedPrefix, command }) => {
    try {
        await m.react('🕒'); 
        conn.sendPresenceUpdate('composing', m.chat);

        const pluginsDir = './plugins';
        if (!fs.existsSync(pluginsDir)) {
            await conn.reply(m.chat, '🚩 *El directorio de plugins no existe.*', m);
            return;
        }

        const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));
        let response = `📂 *Revisión de Errores:*\n\n`;
        let hasErrors = false;

        for (const file of files) {
            try {
                await import(path.resolve(pluginsDir, file));
            } catch (error) {
                hasErrors = true;
                response += `🚩 *Plugin:* ${file}\n`;
                response += `🔍 *Error:* ${error.name}\n`;
                
                const lineMatch = error.stack.match(/eval.*:(\d+):\d+/);
                const lineNumber = lineMatch ? lineMatch[1] : 'Desconocida';
                
                response += `📌 *Línea:* ${lineNumber}\n`;
                response += `💬 *Mensaje:* ${error.message}\n\n`;
            }
        }

        if (!hasErrors) {
            response = '✅ *No se encontraron errores en los plugins*';
        }

        await conn.reply(m.chat, response, m);
        await m.react(hasErrors ? '⚠️' : '✅');
    } catch (err) {
        await m.react('✖️');
        console.error(err);
        conn.reply(m.chat, '🚩 *Error al verificar los plugins*', m);
    }
};

handler.command = ['errores', 'checkerrors'];
handler.help = ['errores (Revisa errores en plugins)'];
handler.tags = ['tools'];

export default handler;
