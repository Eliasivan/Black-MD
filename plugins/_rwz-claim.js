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
        console.error("Error al guardar los datos:", error);
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
        console.error("Error al leer package.json:", error);
        return false;
    }
};

// Manejador principal para el comando
const handler = async (message, { connection }) => {
    if (!message.citado) {
        console.error("Mensaje no citado. Se requiere un mensaje citado para continuar.");
        return;
    }

    if (!validateEnvironment()) {
        await connection.reply(
            message.chat,
            "🚫 Este comando está restringido para los usuarios del Goku-Black-Bot-MD.\n🔗 Visita: https://github.com/Eliasivan/Goku-Black-Bot-MD",
            message
        );
        return;
    }

    const userId = message.remitente;
    const extractedId = message.citado.texto.match(/<id:(.*)>/)?.[1];
    let database;

    // Intentar cargar la base de datos desde el archivo
    try {
        database = fs.existsSync('base_de_datos.json')
            ? JSON.parse(fs.readFileSync('base_de_datos.json', 'utf-8'))
            : { usuarios: {}, personajesReservados: [] };
    } catch (error) {
        console.error("Error al cargar la base de datos:", error);
        database = { usuarios: {}, personajesReservados: [] };
    }

    if (!extractedId) {
        console.error("No se pudo extraer el ID del mensaje citado.");
        return;
    }

    const targetCharacter = database.personajesReservados.find((item) => item.id === extractedId);
    const currentTime = Date.now();
    const lastUsage = cooldowns[userId] || 0;

    if (currentTime - lastUsage < 600000) {
        const remainingTime = 600000 - (currentTime - lastUsage);
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        await connection.reply(
            message.chat,
            `⏳ Por favor espera antes de usar este comando nuevamente.\nTiempo restante: ${minutes} minutos y ${seconds} segundos.`,
            message
        );
        return;
    }

    if (!targetCharacter) {
        await connection.reply(
            message.chat,
            "❌ Lo siento, este personaje no está disponible en este momento.",
            message,
            { menciones: [userId] }
        );
        return;
    }

    const isOwnedBySomeone = database.usuarios[targetCharacter.userId]?.personajes?.some(
        (character) => character.url === targetCharacter.url
    );

    if (isOwnedBySomeone) {
        await connection.reply(
            message.chat,
            `❌ El personaje ${targetCharacter.nombre} ya pertenece a otro usuario. ¡Intenta con otro comando!`,
            message,
            { menciones: [userId] }
        );
        cooldowns[userId] = currentTime;
        return;
    }

    if (targetCharacter.userId !== userId) {
        setTimeout(async () => {
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
                await connection.reply(
                    message.chat,
                    `🎉 Felicidades @${userId.split('@')[0]}, ¡has robado exitosamente a ${targetCharacter.nombre} de @${previousOwner.split('@')[0]}!`,
                    message,
                    { menciones: [userId, previousOwner] }
                );
            } else {
                const currentOwner = targetCharacter.userId;
                await connection.reply(
                    message.chat,
                    `❌ No lograste robar el personaje ${targetCharacter.nombre} de @${currentOwner.split('@')[0]}.`,
                    message,
                    { menciones: [userId, currentOwner] }
                );
            }

            cooldowns[userId] = currentTime;
        });
        return;
    }

    database.usuarios[userId] = database.usuarios[userId] || { personajes: [], conteo: 0, puntosTotales: 0 };

    const userCharacters = database.usuarios[userId];
    const alreadyOwned = userCharacters.personajes.some(
        (character) => character.url === targetCharacter.url
    );

    if (alreadyOwned) {
        await connection.reply(
            message.chat,
            `🎉 ¡Ya posees al personaje ${targetCharacter.nombre}!`,
            message,
            { menciones: [userId] }
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

    await connection.reply(
        message.chat,
        `🎉 Felicidades @${userId.split('@')[0]}, ¡has reclamado exitosamente a ${targetCharacter.nombre}!`,
        message,
        { menciones: [userId] }
    );

    cooldowns[userId] = currentTime;
};

handler.help = ['confirmar'];
handler.tags = ['diversión'];
handler.command = ['cz', 'confirmar'];
handler.group = true;

export default handler;