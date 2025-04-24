/*
• @Eliasivan 
- https://github.com/Eliasivan 
*/
let handler = async (m, { conn }) => {
  if (!m.quoted || !/image/.test(m.quoted.mimetype)) return m.reply('🍬 Por favor, responde a una imagen con el comando *setprofile* para actualizar la foto de perfil de WhatsApp.');
  try {
    const media = await m.quoted.download();
    await conn.updateProfilePicture(conn.user.jid, media);
    await m.reply('🍬 Foto de perfil actualizada.');
  } catch (error) {
    console.error(error);
    m.reply('✘ Hubo un error al intentar cambiar la foto de perfil.');
  }
};