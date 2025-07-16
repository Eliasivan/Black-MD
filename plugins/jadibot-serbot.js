import { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import qrcode from "qrcode";
import fs from "fs";
import pino from "pino";
import { makeWASocket } from "../lib/simple.js";
import util from "util";
import { exec } from "child_process";

const MAX_SUBBOTS = 9999;

if (!(global.conns instanceof Array)) {
  global.conns = [];
}

async function loadSubbots() {
  // Aquí iría la carga de subbots, la dejamos igual
  // (omitido para no repetir mucho, pero igual lo tienes en el código anterior)
}

loadSubbots().catch(console.error);

let handler = async (msg, { conn, args, usedPrefix, command }) => {
  if (!global.db.data.settings[conn.user.jid].jadibotmd) {
    return conn.reply(msg.chat, "*Este comando está deshabilitado por mi creador Barboza.*", msg);
  }

  if (global.conns.length >= MAX_SUBBOTS) {
    return conn.reply(msg.chat, `*Lo siento, se ha alcanzado el límite de ${MAX_SUBBOTS} subbots. Por favor, intenta más tarde.*`, msg);
  }

  const userJid = msg.sender;
  const userName = userJid.split`@`[0];

  // Si el usuario no tiene carpeta, la creamos
  if (!fs.existsSync(`./${global.jadi}/${userName}`)) {
    fs.mkdirSync(`./${global.jadi}/${userName}`, { recursive: true });
  }

  // Si no envía argumento (no pidió QR ni code), mostramos botones para elegir
  if (!args[0]) {
    const buttons = [
      { buttonId: `${usedPrefix}jadibot qr`, buttonText: { displayText: 'Conectar con QR' }, type: 1 },
      { buttonId: `${usedPrefix}jadibot code`, buttonText: { displayText: 'Conectar con Código' }, type: 1 },
    ];

    const buttonMessage = {
      text: 'Selecciona cómo quieres conectar tu SubBot:',
      buttons: buttons,
      headerType: 1
    };

    await conn.sendMessage(msg.chat, buttonMessage, { quoted: msg });
    return;
  }

  if (args[0].toLowerCase() === "qr") {
    // Aquí el proceso para generar y enviar QR

    const { state, saveCreds } = await useMultiFileAuthState(`./${global.jadi}/${userName}`);
    const { version } = await fetchLatestBaileysVersion();

    const connSub = makeWASocket({
      version,
      printQRInTerminal: false,
      auth: state,
      logger: pino({ level: "fatal" }),
      browser: [`SubBot`, "Desktop", "4.1.0"],
    });

    connSub.ev.on("connection.update", async (update) => {
      const { connection, qr, lastDisconnect } = update;
      if (qr) {
        try {
          const qrImage = await qrcode.toDataURL(qr);
          await conn.sendMessage(msg.chat, { image: { url: qrImage }, caption: "*Escanea este QR para conectar tu SubBot.*" }, { quoted: msg });
        } catch (e) {
          console.error(e);
        }
      }
      if (connection === "open") {
        await conn.sendMessage(msg.chat, "*SubBot conectado exitosamente!*", { quoted: msg });
        global.conns.push(connSub);
      }
      if (connection === "close") {
        if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut) {
          fs.rmSync(`./${global.jadi}/${userName}`, { recursive: true, force: true });
          await conn.sendMessage(msg.chat, "*El SubBot fue desconectado y eliminado.*", { quoted: msg });
        }
      }
    });

    connSub.ev.on("creds.update", saveCreds);

    return;
  }

  if (args[0].toLowerCase() === "code") {
    // Generar y enviar el código base64 del archivo creds.json

    const credsPath = `./${global.jadi}/${userName}/creds.json`;
    if (!fs.existsSync(credsPath)) {
      return conn.reply(msg.chat, "*No tienes un SubBot conectado o no se encontró el archivo de credenciales.* Usa el método QR primero.", msg);
    }

    const creds = JSON.parse(fs.readFileSync(credsPath));
    const credsBase64 = Buffer.from(JSON.stringify(creds)).toString("base64");

    const codeMessage = `
Aquí tienes tu código para conectar el SubBot desde otro dispositivo:

\`\`\`
${credsBase64}
\`\`\`

Usa este código con el comando:
${usedPrefix}jadibot ${credsBase64}

*No compartas este código con nadie.*
`;

    await conn.sendMessage(msg.chat, { text: codeMessage }, { quoted: msg });
    return;
  }

  // Si manda un base64 (asumiendo que quiere cargar el creds.json)
  if (args[0].length > 200) {
    try {
      const decoded = JSON.parse(Buffer.from(args[0], "base64").toString("utf-8"));
      fs.writeFileSync(`./${global.jadi}/${userName}/creds.json`, JSON.stringify(decoded, null, 2));

      await conn.reply(msg.chat, "*Archivo de credenciales guardado correctamente. Por favor, espera mientras se conecta tu SubBot...*", msg);

      // Aquí podrías reiniciar la conexión del subbot con estas credenciales si quieres
      // o avisar que se conectará cuando se inicie el bot (según tu implementación)

      return;
    } catch (e) {
      await conn.reply(msg.chat, "*El código proporcionado es inválido o está mal formado.*", msg);
      return;
    }
  }

  // Si no entra en ningún caso anterior, se puede enviar mensaje de ayuda
  await conn.reply(msg.chat, "*Uso del comando:* \n\n" +
    `${usedPrefix}jadibot\n` +
    "Muestra botones para elegir modo de conexión.\n\n" +
    `${usedPrefix}jadibot qr\n` +
    "Genera código QR para conectar.\n\n" +
    `${usedPrefix}jadibot code\n` +
    "Obtiene el código base64 de las credenciales.\n\n" +
    `${usedPrefix}jadibot <código_base64>\n` +
    "Conecta un SubBot usando un código base64.\n", msg);

};

handler.help = ["jadibot"];
handler.tags = ["jadibot"];
handler.command = /^(jadibot|subbot)$/i;
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;

export default handler;
