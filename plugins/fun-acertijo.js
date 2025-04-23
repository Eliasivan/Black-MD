import fs from 'fs';

const timeout = 60000;
const poin = 10;

const handler = async (m, { conn, usedPrefix }) => {
  conn.tekateki = conn.tekateki ? conn.tekateki : {};
  const id = m.chat;

  if (id in conn.tekateki) {
    conn.reply(m.chat, 'Todavía hay acertijos sin responder en este chat', conn.tekateki[id][0]);
    return;
  }

  const tekateki = JSON.parse(fs.readFileSync(`./src/game/acertijo.json`));
  const json = tekateki[Math.floor(Math.random() * tekateki.length)];
  const _clue = json.response;
  const clue = _clue.replace(/[A-Za-z]/g, '_');
  const caption = `🚩 *ACERTIJOS* ✨️\n*${json.question}*\n⏱️ *Tiempo:* ${(timeout / 1000).toFixed(2)} Segundos\n🎁 *Premio:* *+${poin}* Centavos 🪙`.trim();

  conn.tekateki[id] = [
    await conn.sendMessage(m.chat, { text: caption }),
    json,
    poin,
    setTimeout(async () => {
      if (conn.tekateki[id]) {
        await conn.sendMessage(m.chat, { text: `🤍 Se acabó el tiempo!\n*Respuesta:* ${json.response}` });
        delete conn.tekateki[id];
      }
    }, timeout)
  ];
};

handler.help = ['acertijo'];
handler.tags = ['fun'];
handler.command = ['acertijo', 'acert', 'adivinanza', 'tekateki'];

export default handler;