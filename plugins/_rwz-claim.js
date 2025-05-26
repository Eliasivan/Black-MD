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

// Función para reclamar un personaje
const claimCharacterHandler = async (message, { connection }) => {
    try {
        if (!message.citado) {
            await connection.sendMessage(message.chat, { text: "❌ Por favor, cita un mensaje para reclamar un personaje." });
            return;
        }

        if (!validateEnvironment()) {
            await connection.sendMessage(
                message.chat,
                { text: "🚫 Este comando está restringido. Solo usuarios autorizados pueden usarlo." }
            );
            return;
        }

        const userId = message.remitente;
        const extractedId = message.citado.texto.match(/<id:(.*)>/)?.[1];

        if (!extractedId) {
            await connection.sendMessage(
                message.chat,
                { text: "❌ No se pudo extraer un ID válido del mensaje citado." }
            );
            return;
        }

        const database = loadData();
        const targetCharacter = database.personajesReservados.find((item) => item.id === extractedId);

        if (!targetCharacter) {
            await connection.sendMessage(
                message.chat,
                { text: "❌ El personaje no está disponible para reclamar." }
            );
            return;
        }

        database.usuarios[userId] = database.usuarios[userId] || { personajes: [], conteo: 0, puntosTotales: 0 };

        if (database.usuarios[userId].personajes.some((char) => char.id === targetCharacter.id)) {
            await connection.sendMessage(
                message.chat,
                { text: "❌ Ya posees este personaje." }
            );
            return;
        }

        database.usuarios[userId].personajes.push(targetCharacter);
        database.usuarios[userId].conteo++;
        database.usuarios[userId].puntosTotales += targetCharacter.valor;

        database.personajesReservados = database.personajesReservados.filter((item) => item.id !== extractedId);

        saveData(database);

        await connection.sendMessage(
            message.chat,
            { text: `🎉 ¡Felicidades! Has reclamado el personaje: ${targetCharacter.nombre}.` }
        );
    } catch (error) {
        console.error("❌ Error al reclamar el personaje:", error.message);
        await connection.sendMessage(
            message.chat,
            { text: "❌ Ocurrió un error al intentar reclamar el personaje. Intenta nuevamente." }
        );
    }
};

// Función para ver los personajes reclamados
const viewClaimedCharactersHandler = async (message, { connection }) => {
    try {
        const userId = message.remitente;
        const database = loadData();

        if (!database.usuarios[userId] || database.usuarios[userId].personajes.length === 0) {
            await connection.sendMessage(
                message.chat,
                { text: "❌ No tienes personajes reclamados." }
            );
            return;
        }

        const claimedCharacters = database.usuarios[userId].personajes
            .map((char, index) => `${index + 1}. ${char.nombre} (Valor: ${char.valor})`)
            .join('\n');

        await connection.sendMessage(
            message.chat,
            { text: `🎉 Tus personajes reclamados:\n\n${claimedCharacters}` }
        );
    } catch (error) {
        console.error("❌ Error al mostrar personajes reclamados:", error.message);
        await connection.sendMessage(
            message.chat,
            { text: "❌ Ocurrió un error al intentar mostrar tus personajes reclamados." }
        );
    }
};

// Comando principal
const handler = async (message, context) => {
    const command = message.text?.toLowerCase();

    if (command === 'reclamar') {
        await claimCharacterHandler(message, context);
    } else if (command === 'verpersonajes') {
        await viewClaimedCharactersHandler(message, context);
    } else {
        await context.connection.sendMessage(
            message.chat,
            { text: "❌ Comando no reconocido. Usa 'reclamar' para reclamar un personaje o 'verpersonajes' para ver tus personajes reclamados." }
        );
    }
};

// Configuración del comando
handler.help = ['reclamar', 'verpersonajes'];
handler.tags = ['personajes'];
handler.command = ['reclamar', 'verpersonajes'];
handler.group = true;

export default handler;