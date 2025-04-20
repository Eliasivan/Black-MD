let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('`Ingrese el mensaje que deseas enviar`');

  try {
    const channelId = '120363351515256850@newsletter'; //si robas este código recuerda cambiarle el ID créditos a Ivan
    await conn.sendMessage(channelId, { text: text });
    m.reply('*✅ Mensaje enviado al canal*');
  } catch (error) {
    m.reply('*❌ Error al enviar mensaje*');
  }
};

handler.help = ['enviarcanal <mensaje>'];
handler.tags = ['General'];
handler.command = ['enviarchannel'];
handler.rowner = true;

export default handler;