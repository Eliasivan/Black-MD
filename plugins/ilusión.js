let partidos = [];

var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            `⚽ *Comandos disponibles:*\n\n` +
            `1. ${usedPrefix + command} guardar <equipo1 vs equipo2 | marcador inicial | fecha>\n` +
            `2. ${usedPrefix + command} partido\n` +
            `3. ${usedPrefix + command} predicción <equipo1 vs equipo2>\n\n` +
            `Ejemplo:\n` +
            `${usedPrefix + command} guardar Real Madrid vs Barcelona | 0-0 | 2025-06-08`,
            m
        );
    }

    const args = text.split('|').map(arg => arg.trim());

    if (command === 'guardar') {
        if (args.length < 3) {
            return conn.reply(
                m.chat,
                `⚠️ *Formato incorrecto.*\n\nEjemplo: ${usedPrefix + command} guardar Equipo1 vs Equipo2 | Marcador | Fecha`,
                m
            );
        }

        const [teams, initialScore, date] = args;
        partidos.push({ teams, initialScore, date });
        return conn.reply(
            m.chat,
            `✅ *Partido guardado:*\n\n` +
            `≡ *Detalles del Partido*\n` +
            `┌──────────────\n` +
            `▢ 🏟️ Equipos: ${teams}\n` +
            `▢ ⚽ Marcador inicial: ${initialScore}\n` +
            `▢ 📅 Fecha: ${date}\n` +
            `└──────────────`,
            m
        );
    }

    if (command === 'partido') {
        if (partidos.length === 0) {
            return conn.reply(m.chat, `⚠️ No hay partidos programados.`, m);
        }

        let responseMessage = `≡ *Partidos Programados*\n`;
        partidos.forEach((p, i) => {
            responseMessage += `┌──────────────\n`;
            responseMessage += `▢ 🏟️ Partido ${i + 1}: ${p.teams}\n`;
            responseMessage += `▢ ⚽ Marcador: ${p.initialScore}\n`;
            responseMessage += `▢ 📅 Fecha: ${p.date}\n`;
            responseMessage += `└──────────────\n`;
        });

        return conn.reply(m.chat, responseMessage, m);
    }

    if (command === 'predicción') {
        if (args.length < 1) {
            return conn.reply(
                m.chat,
                `⚠️ *Formato incorrecto.*\n\nEjemplo: ${usedPrefix + command} predicción Real Madrid vs Barcelona`,
                m
            );
        }

        const teams = args[0];
        const [team1, team2] = teams.split('vs').map(team => team.trim());
        const score1 = Math.floor(Math.random() * 5);
        const score2 = Math.floor(Math.random() * 5);
        const winner = score1 > score2 ? team1 : score2 > score1 ? team2 : 'Empate';
        const loser = score1 < score2 ? team1 : score2 < score1 ? team2 : 'Ninguno';

        const predictionMessage = `✨ *Predicción del marcador para ${teams}:*\n\n` +
            `▢ ⚽ Marcador estimado: ${score1}-${score2}\n` +
            `▢ 🏆 Equipo ganador: ${winner}\n` +
            `▢ 😞 Equipo perdedor: ${loser}`;

        return conn.reply(m.chat, predictionMessage, m);
    }
};

handler.command = ['guardar', 'partido', 'predicción'];
handler.help = ['guardar <equipo1 vs equipo2 | marcador inicial | fecha>', 'partido', 'predicción <equipo1 vs equipo2>'];
handler.tags = ['sports'];
export default handler;