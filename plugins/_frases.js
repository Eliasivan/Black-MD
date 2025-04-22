let handler = async (m, { conn }) => {
  let frases = ["Te rompo todo, menos el corazón",
"No se trata de entender la vida sino de vivirla"];
  let frase = frases[Math.floor(Math.random() * frases.length)];
  await conn.sendMessage(m.chat, {
    text: frase,
    contextInfo: {
      forwardingScore: 9999999,
      isForwarded: false,
      externalAdReply: {
        title: packname,
        body: "Frases inspiradoras",
        thumbnail: imagen2
      }
    }
  }, { quoted: m });
};

handler.command = ['fraset'];
handler.tags = ['frases'];
handler.help = ['frase'];

export default handler;