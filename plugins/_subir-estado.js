const colors = [
  0xff26c4dc, 0xff792138, 0xff8b6990, 0xfff0b330, 0xffae8774,
  0xff5696ff, 0xffff7b6b, 0xff57c9ff, 0xff243640, 0xffb6b327,
  0xffc69fcc, 0xff54c265, 0xff6e257e, 0xffc1a03f, 0xff90a841,
  0xff7acba5, 0xff8294ca, 0xffa62c71, 0xffff8a8c, 0xff7e90a3,
  0xff74676a
];

let handler = async (m, { conn, text }) => {
  if (!m.quoted && !text) throw '*_Ingrese un texto o reponda a algun archivo multimedia_*';

  try {
    if (m.quoted && m.quoted.mtype !== 'conversation' && !text) {
      await conn.sendMessage('status@broadcast', { forward: m.quoted.fakeObj });
    } else if (m.quoted && m.quoted.mtype === 'conversation' && !text) {
      await conn.sendMessage('status@broadcast', {
        text: m.quoted.text,
        contextInfo: {
          mentionedJid: [],
          forwardingScore: 999,
          isForwarded: true
        },
        backgroundArgb: pickRandom(colors),
        textArgb: 0xffffffff
      }, { quoted: m });
    } else if (!m.quoted && text) {
      await conn.sendMessage('status@broadcast', {
        text,
        contextInfo: {
          mentionedJid: [],
          forwardingScore: 999,
          isForwarded: true
        },
        backgroundArgb: pickRandom(colors),
        textArgb: 0xffffffff
      }, { quoted: m });
    } else if (m.quoted && text) {
      await conn.sendMessage('status@broadcast', {
        text,
        contextInfo: {
          mentionedJid: [],
          forwardingScore: 999,
          isForwarded: true
        },
        backgroundArgb: pickRandom(colors),
        textArgb: 0xffffffff
      }, { quoted: m });
    }

    m.reply('*✅ Estado subido con exito, agenda en tu lista de contactos el número del Bot y pide al propietario del Bot que te agregue a sus contactos para que puedas ver los estados*');
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