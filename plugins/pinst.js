import axios from 'axios';

const pinterest = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, ingresa un texto para buscar en Pinterest');

  await m.react('⏳');

  const url = `https://api.fgmods.xyz/api/search/pinterest?text=${encodeURIComponent(text)}&apikey=fg_STZFglNn`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data && data.length > 0) {
      let index = 0;
      const sendImage = async () => {
        await conn.sendFile(m.chat, data[index], 'pinterest.jpg', `Imagen ${index + 1} de ${data.length}`);
        await conn.sendButton(m.chat, '¿Quieres ver la siguiente imagen?', [
          { text: 'Siguiente', buttonId: 'pinterest_siguiente' },
        ], m);
      };

      await sendImage();

      conn.on('action', async (action) => {
        if (action.type === 'button' && action.buttonId === 'pinterest_siguiente') {
          index++;
          if (index >= data.length) {
            index = 0;
          }
          await sendImage();
        }
      });
    } else {
      await m.react('❌');
      conn.reply(m.chat, 'No se encontraron resultados');
    }
  } catch (error) {
    console.error(error);
    await m.react('❌');
    conn.reply(m.chat, `Error al buscar en Pinterest: ${error.message}`);
  }
};

pinterest.help = ['pinterest'];
pinterest.tags = ['search'];
pinterest.command = ['pint'];

export default pinterest;