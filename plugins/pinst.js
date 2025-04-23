import axios from 'axios';

const igstory = async (m, { conn, args, usedPrefix, command }) => {
  try {
    if (!args || !args[0]) {
      return conn.reply(m.chat, `Ejemplo de uso: ${usedPrefix}${command} https://instagram.com/stories/username/123456789?igshid=example`, m);
    }

    await m.react('⏳');
    const startTime = new Date();

    const response = await axios.get(`https://api.example.com/api/igs?q=${args[0]}`);

    if (response.status !== 200) {
      return conn.reply(m.chat, `❌ Error: Hubo un problema con la solicitud.`, m);
    }

    const data = response.data;

    if (data && data.length > 0) {
      for (const [index, item] of data.entries()) {
        const fileType = item.type === 'video' ? 'mp4' : 'jpg';
        const fileName = `${index + 1}.${fileType}`;

        await conn.sendFile(m.chat, item.url, fileName, `✨ *Tiempo de proceso:* ${new Date() - startTime} ms\n📄 *Archivo*: ${index + 1}/${data.length}`, m);

        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } else {
      conn.reply(m.chat, `No se encontraron resultados`, m);
    }

    await m.react('✅');
  } catch (error) {
    conn.reply(m.chat, `❌ Ocurrió un error al procesar tu solicitud:\n${error.message}`, m);
  }
};

igstory.help = ['igstory'];
igstory.tags = ['downloader'];
igstory.command = ['igs', 'igstory'];
igstory.limit = true;

export default igstory;