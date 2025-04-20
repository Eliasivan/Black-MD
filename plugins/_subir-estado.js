let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('*_Ingrese un texto para subir como estado_*');

  try {
    await conn.sendMessage('status@broadcast', {
      text: text
    });
    m.reply('*✅ Estado subido con exito*');
  } catch (error) {
    m.reply('*❌ Error al subir estado*');
  }
};

handler.help = ['subirestado <texto>'];
handler.tags = ['General'];
handler.command = /^subirestado$/i;
handler.register = false;

export default handler;