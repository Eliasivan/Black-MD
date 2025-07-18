const handler = async (m, { conn, usedPrefix, command }) => {
  const cooldown = 2 * 60 * 60 * 1000; // 2 horas
  const now = new Date();
  const user = global.db.data.users[m.sender];

  if (user.lastrob2 && now - user.lastrob2 < cooldown) {
    const time = msToTime(user.lastrob2 + cooldown - now);
    return conn.reply(m.chat, `${emoji3} ✿ ¡Ya intentaste un robo! ✿\n⏳ Vuelve en *${time}* para hacerlo de nuevo.`, m);
  }

  let target;
  if (m.isGroup) {
    target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
  } else {
    target = m.chat;
  }

  if (!target) {
    return conn.reply(m.chat, `${emoji2} *Debes mencionar a alguien para intentar robarle.*`, m);
  }

  if (!(target in global.db.data.users)) {
    return conn.reply(m.chat, `${emoji2} *Ese usuario no está registrado en la base de datos.*`, m);
  }

  const targetUser = global.db.data.users[target];
  const robAmount = Math.floor(Math.random() * (40000 - 10000 + 1)) + 10000; // entre 10k y 40k

  if (targetUser.coin < robAmount) {
    return conn.reply(m.chat, `${emoji2} @${target.split("@")[0]} *no tiene suficientes ${moneda} fuera del banco como para que valga la pena robarle.*`, m, { mentions: [target] });
  }

  user.coin += robAmount;
  targetUser.coin -= robAmount;
  user.lastrob2 = now * 1;

  let frases = [
    `✿ ¡𝚁𝚘𝚋𝚘 𝙴𝚇𝙸𝚃𝙾𝚂𝙾! ✿\nHas saqueado a @${target.split("@")[0]} y te llevaste *¥${robAmount.toLocaleString()} ${moneda}* 💸`,
    `✿ Tu operación fue silenciosa y eficaz...\n¡Robaste *¥${robAmount.toLocaleString()} ${moneda}* a @${target.split("@")[0]}!`,
    `✿ Te pusiste la capucha y sin ser visto robaste *¥${robAmount.toLocaleString()}* a @${target.split("@")[0]} 😈`,
    `✿ 🏃 Escapaste por los callejones oscuros tras robar *¥${robAmount.toLocaleString()} ${moneda}* de @${target.split("@")[0]}`
  ];

  await conn.reply(m.chat, pickRandom(frases), m, { mentions: [target] });
};

handler.help = ['rob'];
handler.tags = ['rpg'];
handler.command = ['robar', 'steal', 'rob'];
handler.group = true;
handler.register = true;

export default handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function msToTime(duration) {
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  return `${hours} Hora(s) ${minutes} Minuto(s)`;
}
