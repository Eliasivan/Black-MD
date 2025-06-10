import { createHash } from 'crypto';

const handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];
    const name = conn.getName(m.sender);

    if (user.registered === true) throw `🌟 Ya estás registrado.`;

    user.name = name.trim();
    user.registered = true;

    const sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6);

    const mensaje = `✅ ¡Registro completado exitosamente!`;

    const urlImagen = 'https://telegra.ph/file/0bb7e9e7c8cb4e820f1fe.jpg'; // URL de la imagen

    conn.sendMessage(m.chat, {
        image: { url: urlImagen },
        caption: mensaje,
        contextInfo: {
            externalAdReply: {
                title: '🎉 Registro exitoso',
                body: 'Bienvenido al sistema',
                thumbnailUrl: urlImagen,
            }
        }
    });
};

handler.help = ['reg'];
handler.tags = ['rg'];
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'];

export default handler;