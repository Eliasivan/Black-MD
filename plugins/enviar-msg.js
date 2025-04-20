let handler = async (m, { conn, text }) => {
  if (!text || !text.includes('|')) return m.reply('\n`💥 Ingrese el número y el texto separados por |\n`');

  let [numero, mensaje] = text.split('|').map(t => t.trim());
  numero = numero.replace(/[^0-9]/g, '');

  if (!numero || numero.length < 8) return m.reply('💥 Ingrese un número válido');
  if (!mensaje) return m.reply('Ingrese el texto para enviar');

  try {
    await conn.sendMessage(`${numero}@s.whatsapp.net`, { text: mensaje });
    m.reply('✅ Mensaje enviado con éxito');
  } catch (error) {
    m.reply('🛑 Error al enviar mensaje');
  }
};

handler.help = ['enviar'];
handler.tags = ['herramientas'];
handler.command = ['enviar'];
handler.premium = true;

export default handler;