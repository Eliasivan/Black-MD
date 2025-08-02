import fs from 'fs';
import path from 'path';

var handler = async (m, { conn }) => {
    try {
        await m.react('🔍');
        conn.sendPresenceUpdate('composing', m.chat);

        const filesToCheck = [
            './index.js', 
            './handler.js',
            './lib/store.js',
            './lib/Simple.js'
        ].filter(fs.existsSync);

        if (filesToCheck.length === 0) {
            return conn.reply(m.chat, '🚫 No se encontraron archivos principales para analizar', m);
        }

        let errorReport = `⚙️ *Análisis de Archivos Principales* ⚙️\n\n`;
        let errorCount = 0;

        for (const file of filesToCheck) {
            try {
                await import(path.resolve(file));
                errorReport += `✅ ${path.basename(file)}: Sin errores\n`;
            } catch (error) {
                errorCount++;
                const lineMatch = error.stack.match(/eval.*:(\d+):\d+/);
                const lineNumber = lineMatch ? lineMatch[1] : 'Desconocida';
                
                errorReport += `🔴 *${path.basename(file)}*:\n`;
                errorReport += `📌 Tipo: ${error.name}\n`;
                errorReport += `📍 Línea: ${lineNumber}\n`;
                errorReport += `💬 Error: ${error.message.split('\n')[0]}\n\n`;
            }
        }

        errorReport += `\n📝 Resultado: ${errorCount > 0 ? '❌' : '✅'} ${errorCount} error(es) encontrado(s)`;
        await conn.reply(m.chat, errorReport, m);
        await m.react(errorCount > 0 ? '❌' : '✅');

    } catch (globalError) {
        await m.react('⚠️');
        console.error('Error en el verificador:', globalError);
        conn.reply(m.chat, '⚠️ Error al analizar archivos principales', m);
    }
};

handler.command = ['chk', 'verifymain'];
handler.help = ['checkmain (Revisa errores en archivos principales)'];
handler.tags = ['tools'];

export default handler;
