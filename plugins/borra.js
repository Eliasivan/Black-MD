let handler = async (m, { conn }) => {
  if (!m.quoted) return m.reply('Por favor, mencione un mensaje para borrar');

  try {
    await conn.sendMessage(m.chat, { delete: m.quoted.fakeObj.key });
    m.reply('Mensaje borrado con éxito');
  } catch (error) {
    m.reply('Error al borrar mensaje');
  }
};

handler.help = ['borrar'];
handler.tags = ['herramientas'];
handler.command = ['borrar'];

export default handler;