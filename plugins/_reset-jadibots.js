/* Codigo creado por Ivan y modificado por Rayo-ofc para que no se reinicie más el host xd */
import fs from 'fs';
import path from 'path';

let handler = async (m) => {
  try {
    const carpeta = path.join(process.cwd(), 'jadibots');
    fs.rmSync(carpeta, { recursive: true, force: true });
    m.reply('La carpeta "jadibots" ha sido eliminada con éxito ✅');
  } catch (error) {
    if (error.code === 'ENOENT') {
      m.reply('La carpeta "jadibots" no existe 🛑');
    } else {
      m.reply(`Error al eliminar la carpeta: ${error.message} 🛑`);
    }
  }
};

handler.help = ['resetjadibot'];
handler.tags = ['owner'];
handler.command = ['resetjadibots'];
handler.rowner = true;

export default handler;