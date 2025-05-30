const handler = async (m, { conn, args }) => {
  if (!args || args.length < 2) {
    return m.reply(`✳️ Ejemplo de uso:\n.chReact https://whatsapp.com/channel/canal/id-de-mensaje texto de reacción`);
  }

  const channelLinkRegex = /^https:\/\/whatsapp\.com\/channel\/([A-Za-z0-9_-]{22,})\/([A-Za-z0-9_-]+)$/;
  const match = args[0].match(channelLinkRegex);
  
  if (!match) {
    return m.reply("❌ Enlace no válido. Debe ser en formato:\nhttps://whatsapp.com/channel/ID_CANAL/ID_MENSAJE");
  }

  const [, channelId, messageId] = match;
  
  const styleMap = {
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
    h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
    o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
    v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
    0: '⓿', 1: '➊', 2: '➋', 3: '➌', 4: '➍',
    5: '➎', 6: '➏', 7: '➐', 8: '➑', 9: '➒',
    ' ': '―'
  };

  const reactionText = args.slice(1).join(' ').toLowerCase();
  const emojiReaction = reactionText.split('').map(c => styleMap[c] || c).join('');

  try {
    const channelInfo = await conn.newsletterMetadata("invite", channelId);
    if (!channelInfo) {
      return m.reply("❌ No se pudo obtener información del canal. Verifica que el enlace sea correcto.");
    }

    await conn.newsletterReactMessage(channelInfo.id, messageId, emojiReaction);
    return m.reply(`✅ Reacción *${emojiReaction}* enviada correctamente al mensaje en el canal *${channelInfo.name}*`);
  } catch (error) {
    if (error.message.includes('not found')) {
      return m.reply("❌ El canal o mensaje no fue encontrado. Verifica que tengas acceso al canal y que el mensaje exista.");
    }
    if (error.message.includes('react')) {
      return m.reply("❌ Error al enviar la reacción. ¿Tienes permiso para reaccionar en este canal?");
    }
    
    return m.reply("❌ Ocurrió un error inesperado. Por favor intenta nuevamente.");
  }
};

handler.help = ['chReact <enlace_canal> <texto>'];
handler.tags = ['channel'];
handler.command = /^(channelreact|chreact)$/i;

export default handler;