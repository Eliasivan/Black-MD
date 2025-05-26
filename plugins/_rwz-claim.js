import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const cooldowns = {};

const saveData = (data) => {
    try {
        fs.writeFileSync('database.json', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error al guardar los datos:", error);
    }
};

const validateEnvironment = () => {
    try {
        const packageInfo = JSON.parse(fs.readFileSync('./metadata.json', 'utf-8'));
        return (
            packageInfo.name === "Goku-Black-Bot-MD" &&
            packageInfo.repository.url === 'https://github.com/Eliasivan/Goku-Black-Bot-MD.git' &&
            SECRET_KEY === "ir83884kkc82k393i48"
        );
    } catch (error) {
        console.error("Error al leer metadata.json:", error);
        return false;
    }
};

const handler lastUsage = cooldowns[userId] || 0;

    if (currentTime - lastUsage < 600000) {
        const remainingTime = 600000 - (currentTime - lastUsage);
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        await connection.responder(
            message.chat,
            `⏳ Por favor espera antes de usar este comando nuevamente.\nTiempo restante: ${minutes} minutos y ${seconds} segundos.`,
            message
        );
        return;
    }

    if (!targetCharacter) {
        await connection.responder(
            message.chat,
            "❌ Lo siento, este personaje no está disponible en este momento.",
            message,
            { menciones: [userId] }
        );
        return;
    }

    const isOwnedBySomeone = database.users[targetCharacter.userId]?.characters?.some(
        (character) => character.url === targetCharacter.url
    );

    if (isOwnedBySomeone) {
        await connection.responder(
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
                if (!database.users[userId]) {
                    database.users[userId] = { characters: [], count: 0, totalPoints: 0 };
                }

                database.users[userId].characters.push({
                    nombre: targetCharacter.nombre,
                    url: targetCharacter.url,
                    valor: targetCharacter.valor,
                });

                if (database.users[targetCharacter.userId]) {
                    database.users[targetCharacter.userId].characters = database.users[
                        targetCharacter.userId
                    ].characters.filter((character) => character.url !== targetCharacter.url);
                }

                database.reservedCharacters = database.reservedCharacters.filter(
                    (item) => item.id !== extractedId
                );

                saveData(database);

                const previousOwner = targetCharacter.userId;
                await connection.responder(
                    message.chat,
                    `🎉 Felicidades @${userId.split('@')[0]}, ¡has robado exitosamente a ${targetCharacter.nombre} de @${previousOwner.split('@')[0]}!`,
                    message,
                    { menciones: [userId, previousOwner] }
                );
            } else {
                const currentOwner = targetCharacter.userId;
                await connection.responder(
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

    if (!database.users[userId]) {
        database.users[userId] = { characters: [], count: 0, totalPoints: 0 };
    }

    const userCharacters = database.users[userId];
    const alreadyOwned = userCharacters.characters.some(
        (character) => character.url === targetCharacter.url
    );

    if (alreadyOwned) {
        await connection.responder(
            message.chat,
            `🎉 ¡Ya posees al personaje ${targetCharacter.nombre}!`,
            message,
            { menciones: [userId] }
        );
        return;
    }

    userCharacters.characters.push({
        nombre: targetCharacter.nombre,
        url: targetCharacter.url,
        valor: targetCharacter.valor,
    });
    userCharacters.count++;
    userCharacters.totalPoints += targetCharacter.valor;

    database.users[userId] = userCharacters;
    database.reservedCharacters = database.reservedCharacters.filter(
        (item) => item.id !== extractedId
    );

    saveData(database);

    await connection.responder(
        message.chat,
        `🎉 Felicidades @${userId.split('@')[0]}, ¡has reclamado exitosamente a ${targetCharacter.nombre}!`,
        message,
        { menciones: [userId] }
    );

    cooldowns[userId] = currentTime;
};

handler.help = ['confirmar'];
handler.tags = ['diversión'];
handler.command = ['cz', 'confirmarz'];
handler.group = true;

export default handler;