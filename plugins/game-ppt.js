const opciones = ['piedra', 'papel', 'tijera'];
const emojis = {
  piedra: '🪨',
  papel: '📄',
  tijera: '✂️'
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  let eleccionUsuario = text?.toLowerCase()?.trim();

  if (!opciones.includes(eleccionUsuario)) {
    let menu = `*Juguemos Piedra, Papel o Tijera*\n\nElige una opción escribiendo:\n${usedPrefix + command} piedra\n${usedPrefix + command} papel\n${usedPrefix + command} tijera\n\n¡O toca un botón!`;
    return await conn.sendMessage(
      m.chat,
      {
        text: menu,
        buttons: [
          { buttonId: `${usedPrefix + command} piedra`, buttonText: { displayText: `${emojis.piedra} Piedra` } },
          { buttonId: `${usedPrefix + command} papel`, buttonText: { displayText: `${emojis.papel} Papel` } },
          { buttonId: `${usedPrefix + command} tijera`, buttonText: { displayText: `${emojis.tijera} Tijera` } },
        ],
        headerType: 1,
      },
      { quoted: m }
    );
  }

  const eleccionBot = opciones[Math.floor(Math.random() * 3)];

  let resultado = '';
  if (eleccionUsuario === eleccionBot) {
    resultado = '¡Empate! 😐';
  } else if (
    (eleccionUsuario === 'piedra' && eleccionBot === 'tijera') ||
    (eleccionUsuario === 'tijera' && eleccionBot === 'papel') ||
    (eleccionUsuario === 'papel' && eleccionBot === 'piedra')
  ) {
    resultado = '¡Ganaste! 🎉';
  } else {
    resultado = 'Perdiste 😢';
  }

  const body = `*Piedra, Papel o Tijera*\n\nTu elección: ${emojis[eleccionUsuario]} *${eleccionUsuario}*\nMi elección: ${emojis[eleccionBot]} *${eleccionBot}*\n\n${resultado}`;

  await conn.sendMessage(
    m.chat,
    {
      text: body,
      buttons: [
        { buttonId: `${usedPrefix + command} piedra`, buttonText: { displayText: `${emojis.piedra} Piedra` } },
        { buttonId: `${usedPrefix + command} papel`, buttonText: { displayText: `${emojis.papel} Papel` } },
        { buttonId: `${usedPrefix + command} tijera`, buttonText: { displayText: `${emojis.tijera} Tijera` } },
      ],
      headerType: 1,
    },
    { quoted: m }
  );

  if (typeof m.react === "function") m.react('✅');
};

handler.command = ['ppt', 'piedrapapeltijera'];
handler.tags = ['juegos'];
handler.limit = 3;
handler.group = false;

export default handler;