var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            `⚽ *Ingresé los datos del partido*\n\nEjemplo: ${usedPrefix + command} Equipo1 vs Equipo2 | 2-1 | 2025-06-08`,
            m
        );
    }

    try {
        const matchData = text.split('|').map((item) => item.trim());
        if (matchData.length < 3) {
            return conn.reply(
                m.chat,
                `⚠️ *Formato incorrecto.*\n\nEjemplo: ${usedPrefix + command} Equipo-1 | 2025-06-08`,
                m
            );
        }

        const [teams, score, date] = matchData;

        const responseMessage = `≡ *Resultado del Partido* 
┌──────────────
▢ 🏟️ Equipos: ${teams}
▢ ⚽ Marcador: ${score}
▢ 📅 Fecha: ${date}
└──────────────`;

        await conn.reply(m.chat, responseMessage, m);
        await m.react(', `❌ Ocurrió un error: ${error.message}`, m);
    }
};

handler.command = ['partido'];
handler.help = ['partido <equipo1 vs equipo2 | marcador | fecha>'];
handler.tags = ['sports'];
export default handler;