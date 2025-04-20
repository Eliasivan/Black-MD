const toxicRegex = /puto|puta|estupido|imbecil|mrd|verga|vrga|maricon/i;

export async function before(m, { isAdmin, isBotAdmin, isOwner }) {
  // Ignorar mensajes enviados por el bot o mensajes que no sean de grupos
  if (m.isBaileys && m.fromMe) {
    return true;
  }
  if (!m.isGroup) {
    return false;
  }

  // Obtener datos del usuario, chat y configuración global
  const user = global.db.data.users[m.sender] || { warn: 0, banned: false }; // Asegúrate de inicializar los datos del usuario si no existen
  const chat = global.db.data.chats[m.chat] || { antiToxic: false }; // Asegúrate de inicializar los datos del chat si no existen
  const bot = global.db.data.settings[m.conn.user.jid] || {}; // Configuración general del bot

  // Verificar si el texto del mensaje contiene palabras tóxicas
  const isToxic = toxicRegex.exec(m.text);

  // Si el mensaje contiene palabras tóxicas y el sistema anti-tóxico está habilitado
  if (isToxic && chat.antiToxic && !isOwner && !isAdmin) {
    user.warn += 1; // Incrementar el contador de advertencias del usuario

    // Si el usuario no ha alcanzado el límite de advertencias, enviar advertencia
    if (user.warn < 5) {
      await m.reply(
        `*🍧 ${
          user.warn === 1
            ? `Hola @${m.sender.split`@`[0]}`
            : `@${m.sender.split`@`[0]}`
        }, decir la palabra "${isToxic}" está prohibido en este grupo. Advertencia: ${user.warn}/5.*`,
        false,
        { mentions: [m.sender] }
      );
    }

    // Si el usuario alcanza 5 advertencias, reiniciar advertencias y eliminarlo del grupo
    if (user.warn >= 5) {
      user.warn = 0; // Reiniciar advertencias
      await m.reply(
        `*🥀 Hola @${m.sender.split`@`[0]}, superaste las 5 advertencias por lo que serás eliminado de este grupo por tu comportamiento.*`,
        false,
        { mentions: [m.sender] }
      );
      user.banned = true; // Marcar al usuario como baneado
      await m.conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove'); // Eliminar usuario del grupo
    }
  }

  return false;
}