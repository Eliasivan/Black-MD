async function handler(m, { conn, args, usedPrefix, command }) {
  const user = global.db.data.users[m.sender];
  const type = 'estrella';
  const bankType = 'bank';

  if (!args[0] || !args[1]) {
    const helpMessage = `✨ Debes mencionar a quién quieras regalar estrellas.\n> Ejemplo » *${usedPrefix + command} 25000 @mencion*`.trim();
    return conn.sendMessage(m.chat, { text: helpMessage, mentions: [m.sender] }, { quoted: m });
  }

  const count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(100, (isNumber(args[0]) ? parseInt(args[0]) : 100))) * 1;
  const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : args[1] ? (args[1].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : '';

  if (!who) {
    return conn.sendMessage(m.chat, { text: `🌟 Debes regalar al menos 100 estrellas.`, mentions: [m.sender] }, { quoted: m });
  }
  
  if (!(who in global.db.data.users)) {
    return conn.sendMessage(m.chat, { text: `🌟 El usuario ${who} no está en la base de datos.`, mentions: [m.sender] }, { quoted: m });
  }
  
  if (user[bankType] * 1 < count) {
    return conn.sendMessage(m.chat, { text: `🌟 No tienes suficientes estrellas en el banco para transferir.`, mentions: [m.sender] }, { quoted: m });
  }

  user[bankType] -= count * 1;
  global.db.data.users[who][type] += count * 1;

  const mentionText = `@${who.split('@')[0]}`;
  const totalInBank = user[bankType];

  conn.sendMessage(m.chat, { text: `✨ Transferiste *${count} estrellas* a ${mentionText}\n> Ahora tienes *${totalInBank} estrellas* en total en el banco.`, mentions: [who] }, { quoted: m });
}

handler.help = ['pay'];
handler.tags = ['rpg'];
handler.command = ['pay', 'transfer'];
handler.group = true;
handler.register = true;

export default handler;

function isNumber(x) {
  return !isNaN(x);
}