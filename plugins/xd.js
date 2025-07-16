//Este codigo fue creado por ivan me ayudarian mucho siguiendome https://github.com/Eliasivan
import fs from "fs";
import path from "path";

const handler = async (msg, { conn }) => {
  const jadi = "blackJadibots";
  const subbotsFolder = `./${jadi}`;
  const prefixPath = path.join(process.cwd(), "prefixes.json");

  const subDirs = fs.existsSync(subbotsFolder)
    ? fs.readdirSync(subbotsFolder).filter(d =>
        fs.existsSync(path.join(subbotsFolder, d, "creds.json"))
      )
    : [];

  if (subDirs.length === 0) {
    return await conn.sendMessage2(
      msg.key.remoteJid,
      "⚠️ No hay subbots conectados actualmente.",
      msg
    );
  }

  let dataPrefijos = {};
  if (fs.existsSync(prefixPath)) {
    dataPrefijos = JSON.parse(fs.readFileSync(prefixPath, "utf-8"));
  }

  const total = subDirs.length;
  const maxSubbots = 300;
  const disponibles = maxSubbots - total;

  const lista = subDirs.map((dir, i) => {
    const jid = dir.split("@")[0];
    const fullJid = `${jid}@s.whatsapp.net`;

    const prefijo = dataPrefijos[fullJid] || ".";
    const sensurado = `+${jid.slice(0, 3)}*****${jid.slice(-2)}`;

    return `╭➤ *Subbot ${i + 1}*
│ Número: ${sensurado}
│ Prefijo: *${prefijo}*
╰───────────────`;
  });

  const menu = `╭━〔 *SUBBOTS CONECTADOS* 〕━⬣
│ 🤖 Total conectados: *${total}/${maxSubbots}*
│ 🟢 Sesiones libres: *${disponibles}*
╰━━━━━━━━━━━━⬣

${lista.join("\n\n")}`;

  await conn.sendMessage2(
    msg.key.remoteJid,
    { text: menu },
    msg
  );
};

handler.command = ['subs'];
handler.tags = ['owner'];
handler.help = ['bots'];

export default handler;
