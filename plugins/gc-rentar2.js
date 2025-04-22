import db from '../lib/database.js';

let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i;

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply(`📝 Ingresa el link del grupo para rentar el bot.`);
  let [_, code] = text.match(linkRegex) || [];
  if (!code) return m.reply('🚩 Enlace inválido.');

  global.db.data.groupRents = global.db.data.groupRents || {};
  global.db.data.userRents = global.db.data.userRents || {};

  let userRents = global.db.data.userRents[m.sender] || { stars: 1, groups: [] };

  if (userRents.stars <= 0) {
    return m.reply('❎ No tienes estrellas disponibles para rentar el bot. Compra más estrellas con /rentar.');
  }

  let groupMetadata = await conn.groupAcceptInvite(code).catch(async e => {
    if (e.message === 'already-exists') {
      return m.reply('❗ El bot ya está en este grupo.');
    }
    return m.reply(`❗ Error al unirse al grupo: ${e.message}`);
  });

  if (!groupMetadata) return;

  let groupId = groupMetadata.gid;
  global.db.data.groupRents[groupId] = {
    user: m.sender,
    starCount: userRents.stars,
    startTime: Date.now(),
    duration: userRents.stars * 24 * 60 * 60 * 1000
  };

  userRents.stars -= 1;
  userRents.groups.push(groupId);

  global.db.data.chats[groupId] = global.db.data.chats[groupId] || {};
  global.db.data.chats[groupId].expired = global.db.data.groupRents[groupId].startTime + global.db.data.groupRents[groupId].duration;

  await conn.reply(m.chat, `📝 Me uní correctamente al grupo *${groupId}* por ${global.db.data.groupRents[groupId].starCount} día(s).`);
  await conn.reply(groupId, `Ya llegué ⭐️. El bot estará disponible por ${global.db.data.groupRents[groupId].starCount} día(s).`);
};

handler.tags = ['grupos'];
handler.help = ['rentar2 *<link>*'];
handler.command = ['rentar2'];

export default handler;