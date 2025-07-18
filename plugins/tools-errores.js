import fs from 'fs';
import path from 'path';

var handler = async (m, { usedPrefix, command }) => {
    try {
        await m.react('🔎'); 
        conn.sendPresenceUpdate('composing', m.chat);

        const dirs = ['./plugins'];
        let response = `${emoji} *Revisión de Syntax Errors:*\n\n`;
        let hasErrors = false;

        for (const pluginsDir of dirs) {
            const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));

            for (const file of files) {
                try {
                    await import(path.resolve(pluginsDir, file));
                } catch (error) {
                    hasErrors = true;
                    response += `${emoji} *Error en:* ${file} (${pluginsDir})\n`;
                    if (error.loc) {
                        response += `*Línea:* ${error.loc.line}, *Columna:* ${error.loc.column}\n`;
                    }
                    response += `${error.message}\n\n`;
                }
            }
        }

        if (!hasErrors) {
            response += `${emoji} ¡Todo está en orden! No se detectaron errores de sintaxis.`;
        }

        await conn.reply(m.chat, response, m, rcanal);
        await m.react('🔥');
    } catch (err) {
        await m.react('✖️'); 
        console.error(err);
        conn.reply(m.chat, '🚩 *Ocurrió un fallo al verificar los plugins.*', m, rcanal);
    }
};

handler.command = ['errores'];
handler.help = ['errores'];
handler.tags = ['tools'];
handler.register = true;

export default handler;