//para matar el aburrimiento 
let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('*_Ingrese el número del destinatario_*');

  try {
    const audio = 'https://qu.ax/TPNQE.mp3';
    await conn.sendMessage(`${text}@s.whatsapp.net`, { audio: { url: audio }, mimetype: 'audio/mp4' });
    m.reply('*✅ Mensaje enviado al usuario*');
  } catch (error) {
    m.reply('*❌ Error al enviar mensaje*');
  }
};

handler.help = ['enviaraudio <número>'];
handler.tags = ['General'];
handler.command = ['enviaraud']
handler.register = false;

export default handler;