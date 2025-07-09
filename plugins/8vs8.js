let handler = async (m, { conn }) => {
  let who;
  if (m.mentionedJid.length > 0) {
    who = m.mentionedJid[0];
  } else if (m.quoted) {
    who = m.quoted.sender;
  } else {
    who = m.sender;
  }

  let name = await conn.getName(who);
  let name2 = await conn.getName(m.sender);

  let str;
  if (m.mentionedJid.length > 0) {
    str = `\`${name2}\` *golpeó a* \`${name || who}\`.`;
  } else if (m.quoted) {
    str = `\`${name2}\` *golpeó a*  \`${name || who}\`.`;
  } else {
    str = `\`${name2}\` *se golpeó a sí mismo*.`.trim();
  }

  let res = await fetch('https://api.waifu.pics/sfw/slap');
  let json = await res.json();

  let mentions = [who];
  await conn.sendMessage(m.chat, { video: { url: json.url }, gifPlayback: true, caption: str, mentions }, { quoted: m });
}

handler.help = ['slap @tag', 'bofetada @tag'];
handler.tags = ['anime'];
handler.command = ['slap', 'bofetada'];
handler.group = true;

export default handler;