let handler = async (m, { conn, text }) => {
  let user = global.db.data.users[m.sender];
  if (!text) return conn.reply(m.chat, `${emoji} Ingresa el tipo de membresía y la duración.*\n> Ejemplo: #comprarpremium 1 dia`, m);

  let [amount, unit] = text.trim().split(' ');
  amount = parseInt(amount);
  if (isNaN(amount)) return conn.reply(m.chat, `${emoji2} La cantidad debe ser un número.`, m);

  const units = { minuto: 1, minutos: 1, hora: 60, horas: 60, dia: 1440, dias: 1440 };
  if (!units[unit.toLowerCase()]) return conn.reply(m.chat, `${emoji2} Unidad de tiempo no válida. Usa minutos, horas o días.`, m);

  let duration = amount * units[unit.toLowerCase()];
  let cost = Math.floor(duration * 50);

  if (user.coin < cost) return conn.reply(m.chat, `${emoji2} No tienes suficientes ${moneda}. Necesitas *${cost.toLocaleString()} ${moneda}* para comprar esta membresía.`, m);

  user.coin -= cost;
  user.premium = true;
  user.premiumTime = +new Date() + duration * 60 * 1000;

  conn.reply(m.chat, `${emoji} ¡Felicitaciones! Ahora eres miembro premium por *${amount} ${unit}*. Has gastado *${cost.toLocaleString()} ${moneda}*.`, m);
};

handler.help = ['comprarpremium'];
handler.tags = ['premium'];
handler.command = ['comprarpremium', 'premium', 'vip'];
handler.register = true;

export default handler;
