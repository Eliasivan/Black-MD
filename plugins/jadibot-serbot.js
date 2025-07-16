import { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import qrcode from "qrcode";
import fs from "fs";
import pino from "pino";
import { makeWASocket } from "../lib/simple.js";

const MAX_SUBBOTS = 9999;

if (!(global.conns instanceof Array)) {
  global.conns = [];
}

async function connectSubbot(code, msg, conn) {
  const authPath = `./${global.jadi}/${code}`;

  if (!fs.existsSync(authPath)) {
    await conn.sendMessage(msg.chat, `*No existe sesión guardada para el código ${code}.* Usa el comando con 'crear ${code}' para crear una sesión.`, { quoted: msg });
    return;
  }

  const { state, saveCreds } = await useMultiFileAuthState(authPath);
  const { version } = await fetchLatestBaileysVersion();

  const connSub = makeWASocket({
    version,
    printQRInTerminal: false,
    auth: state,
    logger: pino({ level: "fatal" }),
    browser: [`SubBot`, "Desktop", "4.1.0"],
  });

  connSub.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      await conn.sendMessage(msg.chat, `*SubBot con código ${code} conectado exitosamente!*`, { quoted: msg });
      global.conns.push(connSub);
    }

    if (connection === "close") {
      if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut) {
        fs.rmSync(authPath, { recursive: true, force: true });
        await conn.sendMessage(msg.chat, `*SubBot con código ${code} fue desconectado y eliminado.*`, { quoted: msg });
      } else {
        await conn.sendMessage(msg.chat, `*SubBot con código ${code} se desconectó. Intenta reconectar con ${global.prefix}jadibot reconectar ${code}*`, { quoted: msg });
      }
    }
  });

  connSub.ev.on("creds.update", saveCreds);

  return connSub;
}

let handler = async (msg, { conn, args, usedPrefix }) => {
  if (!global.db.data.settings[conn.user.jid].jadibotmd) {
    return conn.reply(msg.chat, "*Este comando está deshabilitado por mi creador Barboza.*", msg);
  }

  if (global.conns.length >= MAX_SUBBOTS) {
    return conn.reply(msg.chat, `*Se alcanzó el límite de ${MAX_SUBBOTS} subbots. Intenta más tarde.*`, msg);
  }

  if (args[0]?.toLowerCase() === "crear" && args[1]) {
    const code = args[1];
    if (!/^\d{8}$/.test(code)) {
      return conn.reply(msg.chat, "*El código debe ser exactamente 8 dígitos numéricos.*", msg);
    }

    const authPath = `./${global.jadi}/${code}`;
    if (fs.existsSync(authPath)) {
      return conn.reply(msg.chat, `*Ya existe una sesión con el código ${code}. Usa otro código o reconecta con ${usedPrefix}jadibot reconectar ${code}*`, msg);
    }

    fs.mkdirSync(authPath, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(authPath);
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
        const qrImage = await qrcode.toDataURL(qr);
        await conn.sendMessage(msg.chat, { image: { url: qrImage }, caption: `*Escanea este QR para conectar el SubBot con código ${code}.*` }, { quoted: msg });
      }

      if (connection === "open") {
        await conn.sendMessage(msg.chat, `*SubBot con código ${code} conectado exitosamente!*`, { quoted: msg });
        global.conns.push(connSub);
      }

      if (connection === "close") {
        if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut) {
          fs.rmSync(authPath, { recursive: true, force: true });
          await conn.sendMessage(msg.chat, `*SubBot con código ${code} fue desconectado y eliminado.*`, { quoted: msg });
        }
      }
    });

    connSub.ev.on("creds.update", saveCreds);

    return;
  }

  if (args[0]?.toLowerCase() === "reconectar" && args[1]) {
    const code = args[1];
    if (!/^\d{8}$/.test(code)) {
      return conn.reply(msg.chat, "*El código debe ser exactamente 8 dígitos numéricos.*", msg);
    }
    await connectSubbot(code, msg, conn);
    return;
  }

  if (args[0]?.toLowerCase() === "qr") {
    const userJid = msg.sender;
    const userName = userJid.split`@`[0];

    if (!fs.existsSync(`./${global.jadi}/${userName}`)) {
      fs.mkdirSync(`./${global.jadi}/${userName}`, { recursive: true });
    }

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

  if (args[0]?.toLowerCase() === "code") {
    const userJid = msg.sender;
    const userName = userJid.split`@`[0];
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

  if (args[0]?.length > 200) {
    try {
      const decoded = JSON.parse(Buffer.from(args[0], "base64").toString("utf-8"));

      const userJid = msg.sender;
      const userName = userJid.split`@`[0];

      const path = `./${global.jadi}/${userName}`;
      if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

      fs.writeFileSync(`${path}/creds.json`, JSON.stringify(decoded, null, 2));
      await conn.reply(msg.chat, "*Archivo de credenciales guardado correctamente. Por favor, espera mientras se conecta tu SubBot...*", msg);

      return;
    } catch (e) {
      await conn.reply(msg.chat, "*El código proporcionado es inválido o está mal formado.*", msg);
      return;
    }
  }

  if (!args[0]) {
    const buttons = [
      { buttonId: `${usedPrefix}jadibot qr`, buttonText: { displayText: 'Conectar con QR' }, type: 1 },
      { buttonId: `${usedPrefix}jadibot code`, buttonText: { displayText: 'Conectar con Código' }, type: 1 },
      { buttonId: `${usedPrefix}jadibot crear 12345678`, buttonText: { displayText: 'Crear sesión con código' }, type: 1 },
      { buttonId: `${usedPrefix}jadibot reconectar 12345678`, buttonText: { displayText: 'Reconectar sesión' }, type: 1 },
    ];

    const buttonMessage = {
      text: 'Selecciona cómo quieres conectar tu SubBot:',
      buttons: buttons,
      headerType: 1
    };

    await conn.sendMessage(msg.chat, buttonMessage, { quoted: msg });
    return;
  }

  await conn.reply(msg.chat, "*Uso del comando:* \n\n" +
    `${usedPrefix}jadibot\n` +
    "Muestra botones para elegir modo de conexión.\n\n" +
    `${usedPrefix}jadibot qr\n` +
    "Genera código QR para conectar.\n\n" +
    `${usedPrefix}jadibot code\n` +
    "Obtiene el código base64 de las credenciales.\n\n" +
    `${usedPrefix}jadibot crear <8-dígitos>\n` +
    "Crea una sesión con un código de 8 dígitos y genera QR para conectar.\n\n" +
    `${usedPrefix}jadibot reconectar <8-dígitos>\n` +
    "Reconecta un SubBot usando un código de 8 dígitos.\n\n" +
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
