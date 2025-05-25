import fetch from 'node-fetch';

let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            '🚩 Ingresa el texto que deseas convertir en un logo.\nEjemplo:\n' + `> *${usedPrefix + command}* Ivan`,
            m
        );
    }

    try {
        let imageUrl;
        let cmd = command;
        let api = {
            "advancedglow": "advancedglow",
            "typography": "typography",
            "pixelglitch": "pixelglitch",
            "glitch": "glitch",
            "neonglitch": "neonglitch",
            "flag": "flag",
            "flag3d": "flag3d",
            "deleting": "deleting",
            "blackpink": "blackpink",
            "glowing": "glowing",
            "underwater": "underwater",
            "logomaker": "logomaker",
            "cartoon": "cartoon",
            "papercut": "papercut",
            "watercolor": "watercolor",
            "affectclouds": "affectclouds",
            "blackpinklogo": "blackpinklogo",
            "gradient": "gradient",
            "summerbeach": "summerbeach",
            "luxurygold": "luxurygold",
            "multicoloredneon": "multicoloredneon",
            "sandsummer": "sandsummer",
            "galaxywallpaper": "galaxywallpaper",
            "1917": "1917",
            "markingneon": "markingneon",
            "royal": "royal",
            "freecreate": "freecreate",
            "galaxy": "galaxy",
            "darkgreen": "darkgreen",
            "lighteffects": "lighteffects",
            "dragonball": "dragonball",
            "neondevil": "neondevil",
            "frozen": "frozen",
            "wooden3d": "wooden3d",
            "metal3d": "metal3d",
            "ligatures": "ligatures",
            "3druby": "3druby",
            "sunset": "sunset",
            "cemetery": "cemetery",
            "halloween": "halloween",
            "horror": "horror",
            "blood": "blood",
            "joker": "joker",
            "clouds": "clouds"
        };

        conn.reply(m.chat, '⏳ Generando tu logo, por favor espera un momento...', m); // Mensaje de progreso

        if (cmd in api) {
            let res = await fetch(`https://carisys.online/api/logos/${api[cmd]}?texto=${encodeURIComponent(text)}`);
            if (!res.ok) throw new Error('Error en la solicitud a la API');
            imageUrl = res.url;
        } else {
            return conn.reply(m.chat, '❌ Comando no reconocido.', m);
        }

        await conn.sendFile(m.chat, imageUrl, 'logo.png', 'Aquí tienes tu logo:', m);
    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, '❌ Ocurrió un error al generar el logo. Inténtalo nuevamente.', m);
    }
};

handler.help = [
    'advancedglow *<texto>*',
    'typography *<texto>*',
    'pixelglitch *<texto>*',
    'glitch *<texto>*',
    'neonglitch *<texto>*',
    'flag *<texto>*',
    'flag3d *<texto>*',
    'deleting *<texto>*',
    'blackpink *<texto>*',
    'glowing *<texto>*',
    'underwater *<texto>*',
    'logomaker *<texto>*',
    'cartoon *<texto>*',
    'papercut *<texto>*',
    'watercolor *<texto>*',
    'affectclouds *<texto>*',
    'blackpinklogo *<texto>*',
    'gradient *<texto>*',
    'summerbeach *<texto>*',
    'luxurygold *<texto>*',
    'multicoloredneon *<texto>*',
    'sandsummer *<texto>*',
    'galaxywallpaper *<texto>*',
    '1917 *<texto>*',
    'markingneon *<texto>*',
    'royal *<texto>*',
    'freecreate *<texto>*',
    'galaxy *<texto>*',
    'darkgreen *<texto>*',
    'lighteffects *<texto>*',
    'dragonball *<texto>*',
    'neondevil *<texto>*',
    'frozen *<texto>*',
    'wooden3d *<texto>*',
    'metal3d *<texto>*',
    'ligatures *<texto>*',
    '3druby *<texto>*',
    'sunset *<texto>*',
    'cemetery *<texto>*',
    'halloween *<texto>*',
    'horror *<texto>*',
    'blood *<texto>*',
    'joker *<texto>*',
    'clouds *<texto>*'
];
handler.tags = ['logotipos'];
handler.command = [
    'advancedglow', 'typography', 'pixelglitch', 'glitch', 'neonglitch', 'flag', 'flag3d',
    'deleting', 'blackpink', 'glowing', 'underwater', 'logomaker', 'cartoon', 'papercut',
    'watercolor', 'affectclouds', 'blackpinklogo', 'gradient', 'summerbeach', 'luxurygold',
    'multicoloredneon', 'sandsummer', 'galaxywallpaper', '1917', 'markingneon', 'royal',
    'freecreate', 'galaxy', 'darkgreen', 'lighteffects', 'dragonball', 'neondevil', 'frozen',
    'wooden3d', 'metal3d', 'ligatures', '3druby', 'sunset', 'cemetery', 'halloween', 'horror',
    'blood', 'joker', 'clouds'
];
handler.register = true;

export default handler;