let handler = async (m, { conn, text }) => {
  if (!m.quoted && !text) throw '*_Ingrese un texto o reponda a algun archivo multimedia_*';

  try {
    if (!m.quoted && text) {
      await conn.sendMessage('status@broadcast', {
        text: text
      });
    } else if (m.quoted) {
      await conn.copyNForward('status@broadcast', m.quoted.fakeObj);
    }

    m.reply('*✅ Estado subido con exito*');
  } catch (error) {
    m.reply('*❌ Error al subir estado*');
  }
};

handler.help = ['subirestado'];
handler.tags = ['General'];
handler.command = /^subirestado$/i;
handler.register = false;

export default handler;