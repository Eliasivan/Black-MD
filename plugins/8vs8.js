let registroFF = {};

const handler = async (m, { conn }) => {
  const chatId = m.chat;

  const textoInicial =
`*8 VERSUS 8 Registro Automático*

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

    registro.titulares = registro.titulares.filter(u => u !== participante);
    registro.suplentes = registro.suplentes.filter(u => u !== participante);

    if (emoji === "✅" && registro.titulares.length < 8) {
      registro.titulares.push(participante);
    } else if (emoji === "🚩") {
      registro.suplentes.push(participante);
    }

    const escuadra1 = registro.titulares.slice(0, 4).map(u => `@${u.split("@")[0]}`).join("\n") || "_Vacío_";
    const escuadra2 = registro.titulares.slice(4, 8).map(u => `@${u.split("@")[0]}`).join("\n") || "_Vacío_";
    const suplentes = registro.suplentes.map(u => `@${u.split("@")[0]}`).join("\n") || "_Nadie aún_";

    const textoActualizado =
`*8 VERSUS 8 Registro Automático*

*Titulares registrados:*
*ESCUADRA 1*
${escuadra1}

*ESCUADRA 2*
${escuadra2}

*SUPLENTES (🚩):*
${suplentes}`;

    await conn.sendMessage(chatId, {
      text: textoActualizado,
      edit: registro.key,
      mentions: [...registro.titulares, ...registro.suplentes]
    });
  });

  return;
};

handler.command = ["8vs8"];
handler.tags = ["freefire"];
handler.help = ["8vs8"];
handler.group = true;

export default handler;