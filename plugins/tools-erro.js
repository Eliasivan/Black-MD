import fs from 'fs';
import path from 'path';

var handler = async (m, { usedPrefix, command }) => {
    try {
        await m.react('🔎');
        conn.sendPresenceUpdate('composing', m.chat);

        const filesToCheck = ['./plugins', './handler.js'];
        let response = `🛡️ *Análisis de Plugins y Handler (Vulnerabilidades, Lags y Malas Prácticas):*\n\n`;
        let problemas = false;

        const patrones = [
            { regex: /eval\s*/, mensaje: '⚠️ Uso inseguro de `eval()`' },
            { regex: /new Function\s*/, mensaje: '⚠️ Uso inseguro de `new Function()`' },
            { regex: /fs\.readFileSync/, mensaje: '⚠️ Lectura síncrona de archivos: posible lag' },
            { regex: /fs\.writeFileSync/, mensaje: '⚠️ Escritura síncrona de archivos: posible lag' },
            { regex: /\.forEach\s*[\w\s,]*async/, mensaje: '⚠️ `async` dentro de `forEach`: puede causar bugs o lag' },
            { regex: /setTimeout\s*\s*async/, mensaje: '⚠️ `async` dentro de `setTimeout`: cuidado con el manejo de errores' },
            { regex: /while\s*true/, mensaje: '⚠️ Bucle infinito detectado (`while(true)`) — riesgo de cuelgue' },
        ];

        for (const fileOrDir of filesToCheck) {
            const isDir = fs.existsSync(fileOrDir) && fs.lstatSync(fileOrDir).isDirectory();

            let files = [];
            if (isDir) {
                files = fs.readdirSync(fileOrDir)
                    .filter(f => f.endsWith('.js'))
                    .map(f => path.resolve(fileOrDir, f));
            } else if (fs.existsSync(fileOrDir)) {
                files = [path.resolve(fileOrDir)];
            }

            for (const filePath of files) {
                const code = fs.readFileSync(filePath, 'utf-8');
                const lines = code.split('\n');
                let hallazgos = [];

                for (let i = 0; i < lines.length; i++) {
                    for (const { regex, mensaje } of patrones) {
                        if (regex.test(lines[i])) {
                            hallazgos.push(`- ${mensaje}\n  🧾 Línea ${i + 1}: \`${lines[i].trim()}\``);
                            problemas = true;
                        }
                    }
                }

                if (hallazgos.length > 0) {
                    response += `📁 *${path.basename(filePath)}*\n${hallazgos.join('\n')}\n\n`;
                }
            }
        }

        if (!problemas) {
            response += '✅ No se encontraron vulnerabilidades ni malas prácticas en los archivos.';
        }

        await conn.reply(m.chat, response, m, rcanal);
        await m.react('🛠️');
    } catch (err) {
        console.error(err);
        await m.react('✖️');
        conn.reply(m.chat, '🚩 *Fallo al analizar los plugins.*', m, rcanal);
    }
};

handler.command = ['xhtm'];
handler.help = ['inspeccionar'];
handler.tags = ['tools'];
handler.register = true;

export default handler