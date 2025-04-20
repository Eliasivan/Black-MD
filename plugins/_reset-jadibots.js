/* Codigo creado por Ivan y modificado por Rayo-ofc para que no se reinicie más el host xd */
const fs = require('fs');
const path = require('path');

let handler = async (m) => {
  try {
    const carpeta = path.join(__dirname, 'jadibots');
    fs.rmdirSync(carpeta, { recursive: true });
    m.reply('La carpeta "jadibots" ha sido eliminada con éxito');
  } catch (error) {
    if (error.code === 'ENOENT') {
      m.reply('La carpeta "jadibots" no existe');
    } else {
      m.reply(`Error al eliminar la carpeta: ${error.message}`);
    }
  }
};

handler.help = ['borrarjadibots'];
handler.tags = ['owner'];
handler.command = ['borrarjadibots'];
handler.rowner = true;

export default handler;