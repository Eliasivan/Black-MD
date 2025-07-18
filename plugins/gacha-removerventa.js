import fs from 'fs';

const ventaFilePath = './src/database/waifusVenta.json';

async function loadVentas() {
  return JSON.parse(fs.readFileSync(ventaFilePath, 'utf-8'));
}

async function saveVentas(data) {
  fs.writeFileSync(ventaFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

let handler = async (m, { conn, args }) => {
  const userId = m.sender;

  if (!args[0]) {
    return m.reply('✿ Usa: *#removerwaifu <nombre del personaje>*');
  }

  const nombre = args.join(' ').trim().toLowerCase();

  const ventas = await loadVentas();
  const venta = ventas.find(v => v.name.toLowerCase() === nombre);

  if (!venta) {
    return m.reply('✘ Esa waifu no está en venta.');
  }

  if (venta.vendedor !== userId) {
    return m.reply('✘ No puedes remover una waifu que no es tuya.');
  }

  const nuevasVentas = ventas.filter(v => v.name.toLowerCase() !== nombre);
  await saveVentas(nuevasVentas);

  m.reply(`✿ Has removido a *${venta.name}* de la venta. Ya no está disponible para ser comprada.`);
};

handler.help = ['removerwaifu <nombre>'];
handler.tags = ['waifus'];
handler.command = ['removerwaifu', 'removerventa', 'removesale'];
handler.group = true;
handler.register = true;

export default handler;
