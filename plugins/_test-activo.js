import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
  let activo = `Estoy activo ✅`;
  await conn.reply(m.chat, activo, m);
  await m.react('👍🏻');
};

handler.help = ['activo'];
handler.tags = ['info'];
handler.command = ['activo'];

export default handler;