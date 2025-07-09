import fetch from 'node-fetch';
import { gifToMp4 } from '../lib/converter.js';

let handler = async (m, { conn, participants }) => {
  try {
    const who = m.quoted ? m.quoted.sender
      : (m.mentionedJid && m.mentionedJid[0])
        ? m.mentionedJid[0]
        : m.sender;

    const isGroup = m.isGroup || !!participants;
    const group_db = isGroup && global.db && global.db.data && global.db.data.chats
      ? global.db.data.chats[m.chat] || { nsfw: true }
      : { nsfw: true };

    if (isGroup && group_db.nsfw === false)
      return m.reply('🚩 Los comandos NSFW están desactivados en este grupo. Pide a un admin que los active.');

    const res = await fetch('https://api.waifu.pics/sfw/slap');
    const json = await res.json();
    const buff = await getBuffer(json.url);
    const mp4 = await gifToMp4(buff);

    let name = conn.getName ? await conn.getName(who) : who.split('@')[0];
    let caption = who !== m.sender
      ? `👋 *${conn.getName(m.sender)}* le dio una bofetada a *${name}*`
      : `👋 *${conn.getName(m.sender)}* se dio una bofetada a sí mismo/a`;

    await conn.sendMessage(m.chat, {
      video: mp4,
      gifPlayback: true,
      caption,
      mentions: who !== m.sender ? [m.sender, who] : [m.sender],
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error al ejecutar el comando, intenta de nuevo.');
  }
};

handler.help = ['slap'];
handler.tags = ['anime'];
handler.command = /^slap$/i;
handler.group = true;

export default handler;