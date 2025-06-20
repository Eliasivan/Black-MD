let registroFF = {};

const handler = async (m, { conn }) => {
  const chatId = m.chat;

  const textoInicial =
`*2 VERSUS 2 Registro Automático*

HORARIO:
- MEXICO:
- COLOMBIA:

MODALIDAD:
JUGADORES:

*Reacciona para registrarte:*
✅ Titular   🚩 Suplente`;

  const mensaje = await conn.sendMessage(chatId, { text: textoInicial }, { quoted: m });
  const mensajeId = mensaje.key.id;

  registroFF[mensajeId] = { titulares: [], suplentes: [], key: mensaje.key };

  conn.ev.on("messages.reaction", async reaction => {
    if (!reaction.key || reaction.key.id !== mensajeId) return;
    const participante = reaction.sender || reaction.participant;
    const emoji = reaction.reaction;
    const registro = registroFF[mensajeId];
    if (!registro) return;

    // Quitar de ambas listas antes de agregar
    registro.titulares = registro.titulares.filter(u => u !== participante);
    registro.suplentes = registro.suplentes.filter(u => u !== participante);

    let mensajeMencion = '';
    if (emoji === "✅" && registro.titulares.length < 2) {
      registro.titulares.push(participante);
      mensajeMencion = `¡@${participante.split("@")[0]} ahora eres TITULAR ✅!`;
    } else if (emoji === "🚩") {
      registro.suplentes.push(participante);
      mensajeMencion = `¡@${participante.split("@")[0]} ahora eres SUPLENTE 🚩!`;
    } else if (emoji === "✅" && registro.titulares.length >= 2) {
      mensajeMencion = `¡@${participante.split("@")[0]}, ya hay 2 titulares!`;
    }

    const titulares = registro.titulares.map(u => `@${u.split("@")[0]}`).join("\n") || "_Vacío_";
    const suplentes = registro.suplentes.map(u => `@${u.split("@")[0]}`).join("\n") || "_Nadie aún_";

    const textoActualizado =
`*2 VERSUS 2 Registro Automático*

*Titulares registrados (✅):*
${titulares}

*Suplentes (🚩):*
${suplentes}

${mensajeMencion}`;

    await conn.sendMessage(chatId, {
      text: textoActualizado,
      edit: registro.key,
      mentions: [...registro.titulares, ...registro.suplentes, participante]
    });
  });

  return;
};

handler.command = ["2vs2"];
handler.tags = ["freefire"];
handler.help = ["2vs2"];
handler.group = true;

export default handler;