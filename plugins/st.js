/* Codigo creado por Rayo-ofc 💫 no olvides de dejar créditos si tomas este código */
import { downloadContentFromMessage } from "@whiskeysockets/baileys";

const handler = async (m, { conn }) => {
  try {
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted) {
      return conn.reply(
        m.chat,
        'Debes responder a una imagen, video o nota de voz para reenviarla.',
        m
      );
    }

    const unwrapMessage = (msg) => {
      let node = msg;
      while (
        node?.viewOnceMessage?.message ||
        node?.viewOnceMessageV2?.message ||
        node?.viewOnceMessageV2Extension?.message ||
        node?.ephemeralMessage?.message
      ) {
        node =
          node.viewOnceMessage?.message ||
          node.viewOnceMessageV2?.message ||
          node.viewOnceMessageV2Extension?.message ||
          node.ephemeralMessage?.message;
      }
      return node;
    };

    const innerMessage = unwrapMessage(quoted);

    let mediaType, mediaMsg;
    if (innerMessage.imageMessage) {
      mediaType = "image";
      mediaMsg = innerMessage.imageMessage;
    } else if (innerMessage.videoMessage) {
      mediaType = "video";
      mediaMsg = innerMessage.videoMessage;
    } else if (innerMessage.audioMessage || innerMessage.voiceMessage || innerMessage.pttMessage) {
      mediaType = "audio";
      mediaMsg = innerMessage.audioMessage || innerMessage.voiceMessage || innerMessage.pttMessage;
    } else {
      return conn.reply(
        m.chat,
        'El mensaje citado no contiene un archivo multimedia soportado.',
        m
      );
    }

    await conn.sendMessage(m.chat, {
      react: { text: "⏳", key: m.key }
    });

    const stream = await downloadContentFromMessage(mediaMsg, mediaType);
    let buffer = Buffer.alloc(0);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    const options = {
      mimetype: mediaMsg.mimetype,
      caption: `*Mensaje recuperado por ${botname}*`
    };

    if (mediaType === "image") {
      options.image = buffer;
    } else if (mediaType === "video") {
      options.video = buffer;
    } else {
      options.audio = buffer;
      options.ptt = mediaMsg.ptt ?? true;
      if (mediaMsg.seconds) options.seconds = mediaMsg.seconds;
    }

    await conn.sendMessage(m.chat, options, { quoted: m });

    await conn.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    });

  } catch (error) {
    console.error("Error en handler:", error);
    await conn.sendMessage(m.chat, {
      react: { text: "❌", key: m.key }
    });
    return conn.reply(
      m.chat,
      'Hubo un problema al procesar el archivo.',
      m
    );
  }
};

handler.command = ['viewonce', 'seenonce'];
handler.tags = ["tool"];
handler.help = ["ver"];

export default handler;
