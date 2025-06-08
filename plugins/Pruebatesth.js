import fetch from "node-fetch";

const handler = async (m, { conn, text }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            `Por favor ingresa el enlace del video de YouTube.\n\nEjemplo: .play2 https://youtube.com/watch?v=Hx920thF8X4`,
            m
        );
    }

    try {
        const apiKey = "sylph-dc801b66a8";
        const apiUrl = `https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(text)}&apikey=${apiKey}`;
        
        let res = await fetch(apiUrl);
        if (!res.ok) {
            return conn.reply(m.chat, `Hubo un problema al conectar con la API. Código de estado: ${res.status}`, m);
        }

        let data = await res.json();
        if (!data || !data.result || !data.result.download_url) {
            return conn.reply(m.chat, `No se pudo obtener un enlace de descarga válido. Respuesta completa: ${JSON.stringify(data)}`, m);
        }

        const { title, download_url } = data.result;
        await conn.sendMessage(m.chat, {
            video: { url: download_url },
            caption: `✎﹏Aquí tienes tu video\n🎥 Título: ${title}`,
        }, { quoted: m });
    } catch (error) {
        return conn.reply(m.chat, `Ocurrió un error: ${error.message}`, m);
    }
};

handler.command = ['play2'];
handler.help = ['play2 <enlace de YouTube>'];
handler.tags = ['downloader'];

export default handler;