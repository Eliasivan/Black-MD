import axios from "axios";
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default;

const handler = async (m, { conn, text }) => {
    if (!text) {
        await m.react("❌"); // Reacción de error
        return m.reply("⚡ *Por favor, ingresa el texto para buscarlo en TikTok.*");
    }

    try {
        await m.react("⭐"); // Reacción inicial para indicar que está buscando
        let info = await tiktok.search(text);

        if (info.length < 5) {
            await m.react("⚠️"); // Reacción de advertencia
            return m.reply("⚠️ *No se encontraron suficientes resultados para mostrar 5 videos.*");
        }

        // Procesar los 5 primeros resultados en formato de carrusel
        let push = [];
        for (let i = 0; i < 5; i++) {
            let { metadata, media } = info[i];

            push.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `
𖥍 *Título:* ${metadata.titulo}
𖥍 *Duración:* ${metadata.duracion} segundos
𖥍 *Creado:* ${metadata.creado}
                    `.trim()
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: "🎥 TikTok Bot 🚀"
                }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: "",
                    hasMediaAttachment: true,
                    videoMessage: await generateWAMessageContent({
                        video: { url: media.no_watermark }
                    }, { upload: conn.waUploadToServer }).then(res => res.videoMessage)
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [
                        {
                            "name": "cta_copy",
                            "buttonParamsJson": JSON.stringify({
                                "display_text": "Descargar Audio 🎧",
                                "copy_code": `.ytmp3 ${media.no_watermark}`
                            })
                        },
                        {
                            "name": "cta_copy",
                            "buttonParamsJson": JSON.stringify({
                                "display_text": "Descargar Video 📹",
                                "copy_code": `.ytmp4 ${media.no_watermark}`
                            })
                        }
                    ]
                })
            });
        }

        // Generar el mensaje en formato carrusel
        const bot = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: '*✨ Resultados de búsqueda en TikTok:*'
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: "⚡ Goku-Black-Bot 🚀"
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            hasMediaAttachment: false
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: [...push]
                        })
                    })
                }
            }
        }, { quoted: m });

        // Enviar el carrusel
        await conn.relayMessage(m.chat, bot.message, { messageId: bot.key.id });
        await m.react("✅"); // Reacción de éxito
    } catch (error) {
        console.error("❌ Error en la búsqueda de TikTok:", error);
        await m.react("❌"); // Reacción de error
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
                    media: {
                        no_watermark: "https://tikwm.com" + video.play,
                        watermark: "https://3. **Código Limpio:**
   - Se utilizaron funciones para generar mensajes y carruseles de forma clara y profesional.

---

### Ejemplo de Uso:
1. **Comando:**
   ```bash
   !tiktoksearch gatos graciosos