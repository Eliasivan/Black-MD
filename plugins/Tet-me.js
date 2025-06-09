// Código para realizar trabajos y ganar estrellas
const handler = async (m, { conn, text }) => {
    const users = global.db.data.users[m.sender];
    const trabajoDisponible = [
        { nombre: "Recolector", recompensa: 1000 },
        { nombre: "Agricultor", recompensa: 1000 },
        { nombre: "Minero", recompensa: 1000 },
        { nombre: "Pescador", recompensa: 1000 },
    ];

    if (!text) {
        let listaTrabajos = trabajoDisponible.map((t, i) => `${i + 1}. ${t.nombre} - ${t.recompensa} 🌟 estrellas`).join('\n');
        return conn.reply(m.chat, `🌟 Lista de trabajos disponibles:\n${listaTrabajos}\n\nEscribe el nombre del trabajo para comenzar, por ejemplo:\n*Recolector*`, m);
    }

    const trabajo = trabajoDisponible.find(t => t.nombre.toLowerCase() === text.toLowerCase());

    if (!trabajo) {
        return conn.reply(m.chat, `🚫 Trabajo no encontrado. Escribe el nombre exacto de uno de los trabajos disponibles.`, m);
    }

    users.estrellas = (users.estrellas || 0) + trabajo.recompensa;

    conn.reply(m.chat, `✅ Has completado el trabajo de *${trabajo.nombre}* y has ganado ${trabajo.recompensa} 🌟 estrellas.\nTotal de estrellas: ${users.estrellas} 🌟`, m);
};

handler.help = ['trabajo *<nombre del trabajo>*'];
handler.tags = ['economy'];
handler.command = ['trabajo', 'job'];
handler.register = true;

export default handler;