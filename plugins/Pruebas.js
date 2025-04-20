let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('`Ingrese el mensaje que deseas enviar`', rcanal);

  try {
    const channelId = '120363351515256850@newsletter';
    await conn.sendMessage(channelId, { text: text });
    m.reply('*✅ Mensaje enviado al canal*');
  } catch (error) {
    m.reply('*❌ Error al enviar mensaje*');
  }
};

handler.help = ['enviarcanal <mensaje>'];
handler.tags = ['General'];
handler.command = ['envir'];
handler.register = false;

export default handler;