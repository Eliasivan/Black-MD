export async function before(m) {
    // Obtiene el nombre del usuario que envió el mensaje
    const username = conn.getName(m.sender);

    // Verifica si el mensaje proviene de un grupo, es un mensaje de difusión o del propio bot
    if (m.chat.endsWith('broadcast') || m.fromMe || m.isGroup) return;

    // Obtiene los datos del usuario desde la base de datos global
    let user = global.db.data.users[m.sender];

    // Verifica si el usuario ha enviado mensajes en las últimas 6 horas (21600000 ms)
    if (new Date() - user.pc < 21600000) return;

    // Saludo dependiendo de la hora (ejemplo: "Buenos días", "Buenas tardes", "Buenas noches")
    const hour = new Date().getHours();
    let saludo = "";
    if (hour >= 5 && hour < 12) {
        saludo = "¡Buenos días!";
    } else if (hour >= 12 && hour < 18) {
        saludo = "¡Buenas tardes!";
    } else {
        saludo = "¡Buenas noches!";
    }

    // Responde al usuario con el mensaje personalizado
    await m.reply(`👋 Hola ${username}!
 *${saludo}*

*⚠️ Nota:* ¡No envíes spam al bot!
⚡️ Escribe !menu para ver los comandos que dispongo.

*🥀 Si tienes dudas o sugerencias, contacta a mi creador: 📍*
💖 +595 992 809980 🧸

*⚡️ Escribe !grupos para ver los grupos oficiales del bot 🦊*

📍 ¿Quieres apoyar el proyecto del bot para que siempre tenga actualizaciones? Puedes apoyarnos con una estrellita 🌟 al repositorio.`);

    // Actualiza el tiempo de último mensaje del usuario
    user.pc = new Date().getTime();
}