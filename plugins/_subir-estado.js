const colors = [
  0xff26c4dc, 0xff792138, 0xff8b6990, 0xfff0b330, 0xffae8774,
  0xff5696ff, 0xffff7b6b, 0xff57c9ff, 0xff243640, 0xffb6b327,
  0xffc69fcc, 0xff54c265, 0xff6e257e, 0xffc1a03f, 0xff90a841,
  0xff7acba5, 0xff8294ca, 0xffa62c71, 0xffff8a8c, 0xff7e90a3,
  0xff74676a
];

let handler = async (m, { conn, text }) => {
  if (!m.quoted && !text) throw '> Ingrese un texto o reponda a algun archivo multimedia';

  try {
    if (!m.quoted && text) {
      await conn.sendMessage('status@broadcast', {
        text,
        backgroundArgb: pickRandom(colors),
        textArgb: 0xffffffff
      });
    } else if (m.quoted) {
      await conn.forwardMessage('status@broadcast', m.quoted.fakeObj);
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

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}