import fs from 'fs/promises';
const userConfigFile = './src/database/userClaimConfig.json';

let handler = async (m, { args }) => {
    const userId = m.sender;
    const texto = args.join(' ').trim();

    if (!texto) {
        return m.reply(`《✧》Debes especificar un mensaje para reclamar un personaje.\n\n> Ejemplos:\n*#setclaim $user ha reclamado a $character!*\n*#setclaim Ahora $user es dueño de $character.*`);
    }

    let config = {};
    try {
        const data = await fs.readFile(userConfigFile, 'utf-8');
        config = JSON.parse(data);
    } catch { config = {}; }

    config[userId] = texto;
    await fs.writeFile(userConfigFile, JSON.stringify(config, null, 2));
    m.reply('✧ ¡Tu mensaje personalizado fue guardado correctamente!');
};

handler.help = ['setclaim <mensaje>'];
handler.tags = ['waifus'];
handler.command = ['setclaim'];
handler.group = true;

export default handler;
