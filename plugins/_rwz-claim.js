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
        console.error("❌ Error al guardar los datos:", error.message);
    }
};

// Función para cargar datos desde el archivo
const loadData = () => {
    try {
        if (fs.existsSync('base_de_datos.json')) {
            const data = fs.readFileSync('base_de_datos.json', 'utf-8');
            return JSON.parse(data);
        }
        return { usuarios: {}, personajesReservados: [] };
    } catch (error) {
        console.error("❌ Error al cargar la base de datos:", error.message);
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

// Manejador principal para el comando
const handler = async (message, { connection }) => {
    try {
        // Verificar si existe el método sendMessage en lugar de reply
        if (!connection?.sendMessage) {
            console.error("❌ La función sendMessage no está definida en la conexión.");
            return;
        }

        if (!message.citado) {
            await connection.sendMessage(
                message.chat,
                { text: "❌ Por favor cita un mensaje que contenga información válida para usar este comando." }
            );
            return;
        }

        if (!validateEnvironment()) {
            await connection.sendMessage(
                message.chat,
                { text: "🚫 Este comando está restringido para los usuarios del Goku-Black-Bot-MD.\n🔗 Visita: https://github.com/Eliasivan/Goku-Black-Bot-MD" }
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

        let database = loadData();
        const targetCharacter = database.personajesReservados.find((item) => item.id === extractedId);
        const currentTime = Date.now();
        const lastUsage = cooldowns[userId] || 0;

        if (currentTime - lastUsage < 600000) {
            const remainingTime = 600000 - (currentTime - lastUsage);
            const minutes = Math.floor(remainingTime / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);
            await connection.sendMessage(
                message.chat,
                { text: `⏳ Por favor espera antes de usar este comando nuevamente.\nTiempo restante: ${minutes} minutos y ${seconds} segundos.` }
            );
            return;
        }

        if (!targetCharacter) {
            await connection.sendMessage(
                message.chat,
                { text: "❌ Lo siento, este personaje no está disponible en este momento." }
            );
            return;
        }

        const isOwnedBySomeone = database.usuarios[targetCharacter.userId]?.personajes?.some(
            (character) => character.url === targetCharacter.url
        );

        if (isOwnedBySomeone) {
            await connection.sendMessage(
                message.chat,
                { text: `❌ El personaje ${targetCharacter.nombre} ya pertenece a otro usuario.` }
            );
            cooldowns[userId] = currentTime;
            return;
        }

        // Intentar robar el personaje
        if (targetCharacter.userId !== userId) {
            const success = Math.random() < 0.5;

            if (success) {
                database.usuarios[userId] = database.usuarios[userId] || { personajes: [], conteo: 0, puntosTotales: 0 };

                database.usuarios[userId].personajes.push({
                    nombre: targetCharacter.nombre,
                    url: targetCharacter.url,
                    valor: targetCharacter.valor,
                });

                if (database.usuarios[targetCharacter.userId]) {
                    database.usuarios[targetCharacter.userId].personajes = database.usuarios[
                        targetCharacter.userId
                    ].personajes.filter((character) => character.url !== targetCharacter.url);
                }

                database.personajesReservados = database.personajesReservados.filter(
                    (item) => item.id !== extractedId
                );

                saveData(database);

                const previousOwner = targetCharacter.userId;
                await connection.sendMessage(
                    message.chat,
                    { text: `🎉 Felicidades @${userId.split('@')[0]}, ¡has robado exitosamente a ${targetCharacter.nombre} de @${previousOwner.split('@')[0]}!` }
                );
            } else {
                const currentOwner = targetCharacter.userId;
                await connection.sendMessage(
                    message.chat,
                    { text: `❌ No lograste robar el personaje ${targetCharacter.nombre} de @${currentOwner.split('@')[0]}.` }
                );
            }

            cooldowns[userId] = currentTime;
            return;
        }

        // Agregar el personaje al usuario
        database.usuarios[userId] = database.usuarios[userId] || { personajes: [], conteo: 0, puntosTotales: 0 };

        const userCharacters = database.usuarios[userId];
        const alreadyOwned = userCharacters.personajes.some(
            (character) => character.url === targetCharacter.url
        );

        if (alreadyOwned) {
            await connection.sendMessage(
                message.chat,
                { text: `🎉 ¡Ya posees al personaje ${targetCharacter.nombre}!` }
            );
            return;
        }

        userCharacters.personajes.push({
            nombre: targetCharacter.nombre,
            url: targetCharacter.url,
            valor: targetCharacter.valor,
        });
        userCharacters.conteo++;
        userCharacters.puntosTotales += targetCharacter.valor;

        database.usuarios[userId] = userCharacters;
        database.personajesReservados = database.personajesReservados.filter(
            (item) => item.id !== extractedId
        );

        saveData(database);

        await connection.sendMessage(
            message.chat,
            { text: `🎉 Felicidades @${userId.split('@')[0]}, ¡has reclamado exitosamente a ${targetCharacter.nombre}!` }
        );

        cooldowns[userId] = currentTime;
    } catch (error) {
        console.error("❌ Error en el manejador:", error.message);
        await connection.sendMessage(
            message.chat,
            { text: "❌ Ocurrió un error al procesar tu comando. Por favor, intenta nuevamente más tarde." }
        );
    }
};

// Configuración del comando
handler.help = ['confirmar'];
handler.tags = ['diversión'];
handler.command = ['cz', 'confirmar'];
handler.group = true;

export default handler;