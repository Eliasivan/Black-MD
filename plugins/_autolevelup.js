import { canLevelUp, xpRange } from '../lib/levelling.js';
import { levelup } from '../lib/canvas.js';

export function before(m, { conn }) {
  let user = global.db.data.users[m.sender];
  let chat = global.db.data.chats[m.chat];

  // Verificar si el autolevel está activado en el chat
  if (!chat.autolevelup) return true;

  // Guardar el nivel anterior
  let before = user.level * 1;

  // Verificar si el usuario puede subir de nivel
  while (canLevelUp(user.level, user.exp, global.multiplier)) {
    user.level++;
  }

  // Si hay un cambio en el nivel, enviar un mensaje de felicitación
  if (before !== user.level) {
    conn.reply(
      m.chat,
      `🎉 *¡FELICIDADES! HAS SUBIDO DE NIVEL* 🎉\n\n` +
        `🌟 *Nuevo Nivel:* ${user.level}\n` +
        `✨ *Nivel Anterior:* ${before}\n` +
        `🏅 *Rango Actual:* ${user.role || 'Sin rango'}\n` +
        `📅 *Fecha:* ${new Date().toLocaleString('id-ID')}\n\n` +
        `🎈 ¡Sigue participando para alcanzar niveles más altos! 🎈`,
      m
    );
  }
  return true;
}