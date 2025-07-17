import {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser,
  Browsers
} from '@whiskeysockets/baileys';

import fs from 'fs';
import chalk from 'chalk';
import pino from 'pino';
import path from 'path';
import { fileURLToPath } from 'url';

import { makeWASocket } from './simple.js';
import store from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JADIBTS_DIR = path.join(__dirname, "../" + jadi);

globalThis.conns = globalThis.conns || [];

export async function startSub() {
  try {
    if (!fs.existsSync(JADIBTS_DIR)) {
      console.log(chalk.bold.whiteBright.bgRed('WARNING:') + " " + chalk.bold.cyanBright("No hay sub-bots previamente conectados"));
      return;
    }
    const botDirs = fs.readdirSync(JADIBTS_DIR);
    for (const botName of botDirs) {
      await startSubBotIfValid(botName);
    }
  } catch (err) {
    console.error("Error en startSub:", err);
  }
}

async function startSubBotIfValid(botName) {
  try {
    const credsPath = path.join(JADIBTS_DIR, botName, "creds.json");
    if (!fs.existsSync(credsPath)) {
      console.log(chalk.bold.whiteBright.bgRed("WARNING:") + " " + chalk.bold.cyanBright("No hay credenciales para " + botName));
      return;
    }
    const credsData = fs.readFileSync(credsPath, "utf-8");
    const credsJSON = JSON.parse(credsData);
    if (credsJSON.fstop) {
      console.log(chalk.bold.whiteBright.bgRed("WARNING:") + " " + chalk.bold.cyanBright("Sub-bot " + botName + " marcado para no iniciar (fstop)"));
      return;
    }
    console.log(chalk.bold.whiteBright.bgGreen("INFO:") + " " + chalk.bold.cyanBright("Iniciando sub-bot " + botName));
    await startSubBot(botName, credsData);
  } catch (err) {
    console.error(chalk.bold.whiteBright.bgRed('WARNING:') + " " + chalk.bold.cyanBright("Error al iniciar sub-bot " + botName));
  }
}

async function startSubBot(botName, credsData) {
  const botFolder = path.join(JADIBTS_DIR, botName);
  const { state, saveState } = await useMultiFileAuthState(botFolder);
  const keyStore = makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }));
  const { version } = await fetchLatestBaileysVersion();
  const socketConfig = {
    auth: {
      creds: state.creds,
      keys: keyStore
    },
    waWebSocketUrl: "wss://web.whatsapp.com/ws/chat?ED=CAIICA",
    logger: pino({ level: "silent" }),
    browser: Browsers.macOS("Desktop"),
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    getMessage: async (msg) => {
      const jid = jidNormalizedUser(msg.remoteJid);
      return (await store.loadMessage(jid, msg.id))?.message || '';
    },
    version
  };
  let conn = makeWASocket(socketConfig);
  conn.isInit = false;
  conn.ev.on("connection.update", (update) => handleConnectionUpdate(conn, update, botName));
  setInterval(async () => {
    if (!conn.user) {
      try {
        conn.ws.close();
        conn.ev.removeAllListeners();
        globalThis.conns = globalThis.conns.filter(c => c !== conn);
      } catch {}
    }
  }, 60000);
  await loadHandler(conn);
  console.log(chalk.bold.whiteBright.bgGreen("INFO:") + " " + chalk.bold.cyanBright(botName + " conectado con éxito"));
  globalThis.conns.push(conn);
}

async function handleConnectionUpdate(conn, update, botName) {
  const { connection, lastDisconnect, isNewLogin } = update;
  if (isNewLogin) conn.isInit = false;
  if (connection === "close") {
    await handleDisconnect(lastDisconnect, conn, botName);
  } else if (connection === "open") {
    conn.isInit = true;
    console.log(chalk.bold.whiteBright.bgGreen('INFO:') + " " + chalk.bold.cyanBright(botName + " conectado correctamente"));
  }
}

async function handleDisconnect(disconnectInfo, conn, botName) {
  const statusCode = disconnectInfo?.error?.output?.statusCode || disconnectInfo?.error?.output?.payload?.statusCode;
  const eliminar = [DisconnectReason.badSession, 404, 403, 405, 401, DisconnectReason.loggedOut];
  const reconectar = [DisconnectReason.restartRequired, DisconnectReason.timedOut, DisconnectReason.connectionClosed, DisconnectReason.connectionLost, 440, 408];
  if (eliminar.includes(statusCode)) {
    console.log(chalk.bold.whiteBright.bgRed("WARNING:") + " " + chalk.bold.cyanBright("Conexión cerrada para " + botName + ", se eliminará la sesión."));
    fs.rmdirSync(path.join(JADIBTS_DIR, botName), { recursive: true });
  } else if (reconectar.includes(statusCode)) {
    console.log("\n" + chalk.bold.whiteBright.bgRed("WARNING:") + " " + chalk.bold.cyanBright("Intentando reconectar a " + botName + "..."));
    await restartSubBot(conn, botName);
  } else {
    console.log(chalk.bold.whiteBright.bgRed("WARNING:") + " " + chalk.bold.cyanBright(botName + " desconectado por razón desconocida: " + statusCode));
    await restartSubBot(conn, botName);
  }
}

async function restartSubBot(conn, botName) {
  const credsPath = path.join(JADIBTS_DIR, botName, "creds.json");
  const credsData = fs.readFileSync(credsPath, "utf-8");
  await startSubBot(botName, credsData).catch(() => {
    console.log(chalk.bold.whiteBright.bgRed('WARNING:') + " " + chalk.bold.cyanBright("Error al conectar " + botName + ", eliminando la sesión."));
    fs.rmdirSync(path.join(JADIBTS_DIR, botName), { recursive: true });
  });
}

async function loadHandler(conn) {
  const handlerPath = path.join(__dirname, "../handler.js");
  try {
    const handlerModule = await import(handlerPath + '?update=' + Date.now());
    if (handlerModule) {
      conn.handler = handlerModule.handler.bind(conn);
      conn.ev.on('messages.upsert', conn.handler);
    }
  } catch (err) {
    console.error("Error en el handler:", err);
  }
}

async function checkSubBots() {
  for (const conn of globalThis.conns) {
    if (!conn.user || !conn.authState || !conn.authState.creds) continue;
    const jid = conn.authState.creds.me?.jid || "Desconocido";
    if (!conn.isInit) await restartSubBot(conn, jid);
  }
}

setInterval(checkSubBots, 60000);
