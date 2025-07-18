import fs from 'fs';

const charactersFilePath = './src/database/characters.json';
const ventaFilePath = './src/database/waifusVenta.json';

async function loadCharacters() {
  return JSON.parse(fs.readFileSync(charactersFilePath, 'utf-8'));
}

async function saveCharacters(characters) {
  fs.writeFileSync(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8');
}

async function loadVentas() {
  return JSON.parse(fs.readFileSync(ventaFilePath, 'utf-8'));
}

async function saveVentas(data) {
  fs.writeFileSync(ventaFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

let handler = async (m, { conn, args }) => {
  const userId = m.sender;
  const user = global.db.data.users[userId];

  if (!args[0]) return m.reply('✿ Usa: *#comprarwaifu <nombre de waifu>*');

  const nombre = args.join(' ').trim().toLowerCase();

  const ventas = await loadVentas();
  const characters = await loadCharacters();

  const venta = ventas.find(w => w.name.toLowerCase() === nombre);
  if (!venta) return m.reply('✘ Esa waifu no está en venta.');

  if (venta.vendedor === userId) return m.reply('✘ No puedes comprar tu propia waifu.');

  const precio = parseInt(venta.precio);

  if (user.coin < precio) {
    return m.reply(`✘ No tienes suficientes *${moneda}*. Necesitas *¥${precio.toLocaleString()} ${moneda}*.`);
  }

  const waifu = characters.find(c => c.name.toLowerCase() === nombre);
  if (!waifu) return m.reply('✘ No se encontró ese personaje en la base de datos.');

  user.coin -= precio;
  const vendedorId = venta.vendedor;
  global.db.data.users[vendedorId].coin += precio;

  waifu.user = userId;
  waifu.status = "Reclamado";

  const nuevasVentas = ventas.filter(w => w.name.toLowerCase() !== nombre);
  await saveVentas(nuevasVentas);
  await saveCharacters(characters);

  let nombreComprador = await conn.getName(userId);
  let textoPrivado = `✿ Tu waifu *${waifu.name}* fue comprada por *${nombreComprador}*.\nGanaste *¥${precio.toLocaleString()} ${moneda}*.`;
  await conn.sendMessage(vendedorId, { text: textoPrivado }, { quoted: m });

  m.reply(`✿ Has comprado a *${waifu.name}* por *¥${precio.toLocaleString()} ${moneda}* exitosamente!\nAhora es parte de tu harem.`);
};

handler.help = ['comprarwaifu <nombre>'];
handler.tags = ['waifus'];
handler.command = ['comprarwaifu', 'buycharacter', 'buychar', 'buyc'];
handler.group = true;
handler.register = true;

export default handler;
