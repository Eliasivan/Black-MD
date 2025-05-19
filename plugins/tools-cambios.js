handler.command = ['cambio', 'convertir', 'moneda'];
handler.help = ['cambio <monto> <tipo>\nEjemplo: .cambio 100 dolar-a-pyg'];
handler.tags = ['Economia'];
handler.admin = false;
handler.group = true;

handler.ejecutar = async (m, { conn, args }) => {
  // Tipos de cambio (actualízalos cuando lo necesites)
  const cambio = {
    "dolar-a-pyg": 7200,
    "pyg-a-dolar": 0.000139,
  };

  // Si no hay argumentos, muestra la ayuda y el cambio actual
  if (!args[0] || !args[1]) {
    const resultado = `*Cambio actual:*\n- 1 Dólar = ${cambio["dolar-a-pyg"]} Guaraníes\n- 1 Guaraní = ${cambio["pyg-a-dolar"]} Dólares\n\n*Ejemplo de uso:*\n.cambio 50 dolar-a-pyg\n.cambio 300000 pyg-a-dolar`;
    return conn.reply(m.chat, resultado, m);
  }

  const monto = parseFloat(args[0].replace(/,/g, '.'));
  const tipo = args[1].toLowerCase();

  if (isNaN(monto) || !(tipo in cambio)) {
    const errorMsg = `❌ Uso incorrecto.\n*Ejemplo de uso:*\n.cambio 50 dolar-a-pyg\n.cambio 300000 pyg-a-dolar\n\n*Opciones:* dolar-a-pyg | pyg-a-dolar`;
    return conn.reply(m.chat, errorMsg, m);
  }

  const resultadoCambio = monto * cambio[tipo];
  let mensaje = '';

  if (tipo === "dolar-a-pyg") {
    mensaje = `💱 *${monto} Dólares* son aproximadamente *${resultadoCambio.toLocaleString('es-PY')} Guaraníes*.`;
  } else if (tipo === "pyg-a-dolar") {
    mensaje = `💱 *${monto} Guaraníes* son aproximadamente *${resultadoCambio.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} Dólares*.`;
  }

  return conn.reply(m.chat, mensaje, m);
};

export default handler;