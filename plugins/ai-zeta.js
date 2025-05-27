import axios from 'axios';

const handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `✨ *Ingresa una búsqueda*\n\nEjemplo: ${usedPrefix + command} paisajes hermosos`,
      m
    );
  }

  try {
    await m.react('🕒');
    conn.sendPresenceUpdate('composing', m.chat);

    const response = await axios.get(`https://api.dorratz.com/v2/pinterest?q=${encodeURIComponent(text)}`);
    const data = response.data;

    if (data && data.result) {
      const results = data.result.map((item, index) => `🔹 ${index + 1}. ${item.title}\n${item.link}`).join('\n\n');
      await conn.reply(
        m.chat,
        `✨ *Resultados de Pinterest para:* "${text}"\n\n${results}`,
        m
      );
    } else {
      conn.reply(m.chat, '❌ No se encontraron resultados para tu búsqueda.', m);
    }

    await m.react('✅️');
  } catch (error) {
    console.error("❌ Error al obtener la respuesta de la API:", error.message);
    conn.reply(
      m.chat,
      '❌ Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.',
      m
    );
  }
};

handler.command = ['pin1'];
handler.help = ['pinterest'];
handler.tags = ['search'];

export default handler;