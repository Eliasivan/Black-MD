handler.ejecutar = async (m, { conn, args }) => {
  try {
    const cambio = {
      "dolar-a-pyg": 7200,
      "pyg-a-dolar": 0.000139,
    };

    if (!args[0] || !args[1]) {
      const resultado = `*Cambio actual:*\n- 1 Dólar = ${cambio["dolar-a-pyg"]} Guaraníes\n- 1 Guaraní = ${cambio["pyg-a-dolar"]} Dólares\n\n*Ejemplo de uso:*\n.cambio 50 dolar-a-pyg\n.cambio 300000 pyg-a-dolar`;
      return conn.reply(m.chat, resultado, m);
    }

    const monto = parseFloat(args[0].replace(/,/g, '').replace(/\./g, ''));
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
      mensaje = `💱 *${monto} Guaraníes* son aproximadamente *${resultadoCambio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Dólares*.`;
    }

    return conn.reply(m.chat, mensaje, m);
  } catch (error) {
    console.error(error);
    return conn.reply(m.chat, '❌ Ocurrió un error al procesar el comando. Inténtalo nuevamente más tarde.', m);
  }
};

handler.command = ['cambio', 'convertir', 'moneda'];

export default handler;