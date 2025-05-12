import axios from "axios";

const handler = async (m, { conn, text}) => {
    if (!text) return m.reply("🔍 *Por favor, ingresa un término de búsqueda para encontrar videos en TikTok.*");

    try {
        m.react("🔄");
        let info = await tiktok.search(text);
        let videoAleatorio = Math.floor(Math.random() * info.length);
        let { metadata, estadisticas, author, media} = info[videoAleatorio];

        let mensaje = `
🎥 *Título:* ${metadata.titulo}
⏳ *Duración:* ${metadata.duracion} segundos
📅 *Creado:* ${metadata.creado}

📊 *Estadísticas:*
👀 *Reproducciones:* ${estadisticas.reproducciones}
❤️ *Likes:* ${estadisticas.likes}
💬 *Comentarios:* ${estadisticas.comentarios}
🔄 *Compartidos:* ${estadisticas.compartidos}
⬇️ *Descargas:* ${estadisticas.descargas}

👤 *Autor:* ${author.name}
`;

        await conn.sendFile(m.chat, media.no_watermark, "tiktok_video.mp4", mensaje, m);
} catch (error) {
        console.error("❌ Error en la búsqueda de TikTok:", error);
        m.reply("⚠️ *No se encontraron resultados o hubo un error en la API.*");
}
};

handler.command = ["tiktoksearch"];
export default handler;

const tiktok = {
    search: async function (q) {
        try {
            const data = {
                count: 20,
                cursor: 0,
                web: 1,
                hd: 1,
                keywords: q,
};

            const config = {
                method: "post",
                url: "https://tikwm.com/api/feed/search",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    Accept: "application/json, text/javascript, */*; q=0.01",
                    "X-Requested-With": "XMLHttpRequest",
                    "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
                    Referer: "https://tikwm.com/",
},
                data: data,
};

            const response = await axios(config);

            if (response.data.data) {
                return response.data.data.videos.map((video) => ({
                    metadata: {
                        titulo: video.title,
                        duracion: video.duration,
                        region: video.region,
                        video_id: video.video_id,
                        creado: new Date(video.create_time * 1000).toLocaleString("es-AR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                            hour12: false,
}),
},
                    estadisticas: {
                        reproducciones: Number(video.play_count).toLocaleString(),
                        likes: Number(video.digg_count).toLocaleString(),
                        comentarios: Number(video.comment_count).toLocaleString(),
                        compartidos: Number(video.share_count).toLocaleString(),
                        descargas: Number(video.download_count).toLocaleString(),
},
                    author: {
                        name: video.author.nickname,
                        username: "@" + video.author.unique_id,
},
                    media: {
                        no_watermark: "https://tikwm.com" + video.play,
                        watermark: "https://tikwm.com" + video.wmplay,
                        audio: "https://tikwm.com" + video.music,
},
}));
} else {
                throw new Error("Sin información disponible");
}
} catch (error) {
            throw new Error("Error en la búsqueda de TikTok: " + error);
}
},
};