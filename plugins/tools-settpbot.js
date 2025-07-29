import { downloadMediaMessage } from '@whiskeysockets/baileys';

const handler = async (m, { conn, isOwner }) => {
  if (!isOwner) {
    return m.reply('❌ Este comando solo puede ser usado por el propietario del bot.');
  }

  if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
    return m.reply('📸 Por favor, responde a una imagen con el comando para cambiar la foto de perfil del bot.');
  }

  try {
    const mediaBuffer = await downloadMediaMessage(
      m.quoted,
      'buffer',
      {},
      { logger: console }
    );

    await conn.updateProfilePicture(conn.user.jid, mediaBuffer);
    m.reply('✅ Foto de perfil del bot actualizada con éxito.');
  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error al actualizar la foto de perfil del bot.');
  }
};

handler.help = ['setppbot'];
handler.tags = ['owner'];
handler.command = /^setppbot$/i;
handler.owner = true;

export default handler;
