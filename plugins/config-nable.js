const features = {
  welcome:   { keys: ['welcome', 'bienvenida'], flag: 'welcome' },
  detect:    { keys: ['detect', 'avisos'], flag: 'detect' },
  antidelete:{ keys: ['antidelete', 'antieliminar', 'delete'], flag: 'delete' },
  antilink:  { keys: ['antilink', 'antienlace'], flag: 'antiLink' },
  modohorny: { keys: ['modohorny', 'modocaliente', 'modehorny'], flag: 'modohorny' },
  autolevelup:{keys: ['autolevelup', 'autonivel', 'nivelautomatico'], flag: 'autolevelup' },
  reaction:  { keys: ['reaction', 'reacciones'], flag: 'reaction' },
  antitoxic: { keys: ['antitoxic'], flag: 'antitoxic' },
  audios:    { keys: ['audios'], flag: 'audios' },
  modoadmin: { keys: ['modoadmin', 'soloadmin'], flag: 'modoadmin' },
  antifake:  { keys: ['antifake', 'antiextranjeros'], flag: 'antifake' },
};

const findFeature = (name) => Object.entries(features).find(([,v]) => v.keys.includes(name));

const handler = async (m, { conn, usedPrefix, args, isOwner, isAdmin }) => {
  if (!args[0]) return conn.reply(m.chat, `❌ Especifica la función.\nEjemplo: *${usedPrefix}welcome on*`, m);

  const type = args[0].toLowerCase();
  const entry = findFeature(type);
  if (!entry) {
    return conn.reply(m.chat, `❌ La función *${type}* no es válida.\nUsa *${usedPrefix}help* para ver las funciones disponibles.`, m);
  }
  const flag = entry[1].flag;

  let isEnable;
  if (args[1]?.toLowerCase() === 'on') isEnable = true;
  else if (args[1]?.toLowerCase() === 'off') isEnable = false;
  else {
    const chat = global.db.data.chats[m.chat] || {};
    const estado = chat[flag] ? '✓ Activado' : '✗ Desactivado';
    return conn.reply(m.chat, `❌ Uso incorrecto del comando.\n\nFormato: *${usedPrefix}${type} <on/off>*\nEjemplo: *${usedPrefix}${type} on*\n\n📋 Estado actual: *${estado}*`, m);
  }

  if (m.isGroup ? !isAdmin : !isOwner) {
    global.dfail(m.isGroup ? 'admin' : 'owner', m, conn);
    throw false;
  }

  const chat = global.db.data.chats[m.chat] || {};
  chat[flag] = isEnable;
  global.db.data.chats[m.chat] = chat;

  if (global.db.write) await global.db.write();

  conn.reply(m.chat, `💫 *La función "${type}" se ha ${isEnable ? 'activado' : 'desactivado'} correctamente.*`, m);
};

handler.help = ['<función> on', '<función> off'];
handler.tags = ['settings'];
handler.command = Object.values(features).flatMap(f => f.keys);
export default handler;