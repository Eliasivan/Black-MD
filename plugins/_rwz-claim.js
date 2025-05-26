import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const cooldowns = {};

// Función para guardar datos en un archivo JSON
const saveData = (data) => {
    try {
        fs.writeFileSync('base_de_datos.json', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("❌ Error al guardar datos:", error.message);
    }
};

// Función para cargar datos desde el archivo JSON
const loadData = () => {
    try {
        if (fs.existsSync('base_de_datos.json')) {
            const data = fs.readFileSync('base_de_datos.json', 'utf-8');
            return JSON.parse(data);
        }
        return { usuarios: {}, personajesReservados: [] };
    } catch (error) {
        console.error("❌ Error al cargar datos:", error.message);
        return { usuarios: {}, personajesReservados: [] };
    }
};

// Función para validar el entorno de ejecución
const validateEnvironment = () => {
    try {
        const packageInfo = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
        return (
            packageInfo.name === "Goku-Black-Bot-MD" &&
            packageInfo.repository.url === 'https://github.com/Eliasivan/Goku-Black-Bot-MD.git' &&
            SECRET_KEY === "ir83884kkc82k393i48"
        );
    } catch (error) {
        console.error("❌ Error al validar el entorno:", error.message);
        return false;
    }
};

// Función para enviar mensajes de forma segura
const safeSendMessage = async (connection, chatId, message) => {
    if (!connection || typeof connection.sendMessage !== 'function') {
        console.error("❌ La conexión no tiene definida la función 'sendMessage'.");
        return;
    }

    try {
        await connection.sendMessage(chatId, { text: message });
    } catch (error) {
        console.error(`❌ Error al enviar mensaje: ${error.message}`);
    }
};

// Manejador principal para el comando
const handler = async (message, { connection }) => {
    try {
        if (!message.citado) {
            await safeSendMessage(connection, message.chat, "❌ Por favor, cita un mensaje para usar este comando.");
            return;
        }

        if (!validateEnvironment()) {
            await safeSendMessage(
                connection,
                message.chat,
                "🚫 Este comando está restringido. Solo usuarios autorizados pueden usarlo."
            );
            return;
        }

        const userId = message.remitente;
        const extractedId = message.citado.texto.match(/<id:(.*)>/)?.[1];

        if (!extractedId) {
            await safeSendMessage(
                connection,
                message.chat,
                "❌ No se pudo extraer un ID válido del mensaje citado."
            );
            return;
        }

        const database = loadData();
        const targetCharacter = database.personajesReservados.find((item) => item.id === extractedId);

        if (!targetCharacter) {
            await safeSendMessage(connection, message.chat, "❌ El personaje no está disponible para reclamar.");
            return;
        }

        database.usuarios[userId] = database.usuarios[userId] || { personajes: [], conteo: 0, puntosTotales: 0 };

        if (database.usuarios[userId].personajes.some((char) => char.id === targetCharacter.id)) {
            await safeSendMessage(connection, message.chat, "❌ Ya posees este personaje.");
            return;
        }

        database.usuarios[userId].personajes.push(targetCharacter);
        database.usuarios[userId].conteo++;
        database.usuarios[userId].puntosTotales += targetCharacter.valor;

        database.personajesReservados = database.personajesReservados.filter((item) => item.id !== extractedId);

        saveData(database);

        await safeSendMessage(
            connection,
            message.chat,
            `🎉 ¡Felicidades! Has reclamado el personaje: ${targetCharacter.nombre}.`
        );
    } catch (error) {
        console.error("❌ Error en el manejador:", error.message);
        await safeSendMessage(
            connection,
            message.chat,
            "❌ Ocurrió un error al procesar tu comando. Por favor, intenta nuevamente."
        );
    }
};

// Configuración del comando
handler.help = ['reclamar'];
handler.tags = ['personajes'];
handler.command = ['reclamar'];
handler.group = true;

export default handler;