import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return conn.reply(
            m.chat,
            `❌ Uso incorrecto del comando.\n\nFormato: *${usedPrefix}${command} <nombre-del-pokemon>*\nEjemplo: *${usedPrefix}${command} charizard*`,
            m
        );
    }

    const query = args[0].toLowerCase();
    const apiUrl = `https://delirius-apiofc.vercel.app/tools/pokemon?query=${query}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API responded with status ${response.status}`);
        
        const pokemonData = await response.json();
        const { name, description, image } = pokemonData;

        if (!name || !description || !image) {
            throw new Error('Datos incompletos recibidos de la API.');
        }

        const caption = `✨ *Información del Pokémon*\n\n📛 *Nombre:* ${name}\n📝 *Descripción:* ${description}`;
        await conn.sendMessage(m.chat, { image: { url: image }, caption });
    } catch (error) {
        console.error(error);
        conn.reply(
            m.chat,
            `❌ Ocurrió un error al buscar información sobre el Pokémon *${query}*. Por favor, inténtalo nuevamente más tarde.`,
            m
        );
    }
};

handler.help = ['pokemon'];
handler.tags = ['tools'];
handler.command = ['pokemon']; // Comando asociado

export default handler;