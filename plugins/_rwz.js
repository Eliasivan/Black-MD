const personajesDB = [
    { id: 1, nombre: "Goku" },
    { id: 2, nombre: "Vegeta" },
    { id: 3, nombre: "Gohan" },
    { id: 4, nombre: "Piccolo" },
    { id: 5, nombre: "Trunks" },
    { id: 6, nombre: "Krilin" },
    { id: 7, nombre: "Majin Buu" },
    { id: 8, nombre: "Freezer" },
    { id: 9, nombre: "Cell" },
    { id: 10, nombre: "Beerus" },
];

const personajesReclamados = {};

let handler = async (m, { conn, command, text }) => {
    try {
        if (command === 'rwz') {
            const personaje = personajesDB[Math.floor(Math.random() * personajesDB.length)];
            const mensaje = `✨ *Personaje Aleatorio* ✨\n\n` +
                `🆔 ID: ${personaje.id}\n` +
                `🌀 Nombre: ${personaje.nombre}\n\n` +
                `Para reclamarlo, usa el comando:\n*reclamar ${personaje.id}*`;
            return m.reply(mensaje);
        }

        if (command.startsWith('reclamar')) {
            const id = parseInt(text.trim());
            const personaje = personajesDB.find(p => p.id === id);

            if (!personaje) {
                return m.reply('❌ ID inválido. Por favor, verifica el ID del personaje.');
            }

            if (personajesReclamados[id]) {
                return m.reply(`❌ Este personaje ya ha sido reclamado por @${personajesReclamados[id]}.`);
            }

            personajesReclamados[id] = m.sender;
            return m.reply(`✅ ¡Has reclamado a ${personaje.nombre}! 🎉`);
        }

        if (command === 'rwzharem') {
            if (Object.keys(personajesReclamados).length === 0) {
                return m.reply('❌ No hay personajes reclamados aún.');
            }

            let mensaje = '✨ *Lista de Personajes Reclamados* ✨\n\n';
            for (const id in personajesReclamados) {
                const personaje = personajesDB.find(p => p.id === parseInt(id));
                mensaje += `🆔 ID: ${id}\n🌀 Nombre: ${personaje.nombre}\n👤 Reclamado por: @${personajesReclamados[id]}\n\n`;
            }
            return m.reply(mensaje.trim());
        }

    } catch (error) {
        console.error('❌ Error al procesar el comando:', error);
        m.reply('❌ Hubo un error al procesar tu solicitud.');
    }
};

handler.help = ['rwz', 'reclamar', 'rwzharem'];
handler.tags = ['fun'];
handler.command = ['rwz', 'reclamar', 'rwzharem'];

export default handler;