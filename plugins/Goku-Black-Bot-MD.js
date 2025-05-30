const handler = async (m, { conn, args }) => {
    if (!args || args.length < 1) {
        return m.reply(`✳️ Ejemplo de uso:\n.follow https://whatsapp.com/channel/ID_CANAL`);
    }

    // Validar el formato del enlace del canal
    const channelLinkRegex = /^https:\/\/whatsapp\.com\/channel\/([A-Za-z0-9_-]{22,})$/;
    const match = args[0].match(channelLinkRegex);

    if (!match) {
        return m.reply("❌ Enlace no válido. Debe ser en formato:\nhttps://whatsapp.com/channel/ID_CANAL");
    }

    const channelId = match[1];

    try {
        // Seguir el canal
        const channelInfo = await conn.newsletterMetadata("invite", channelId);
        if (!channelInfo) {
            return m.reply("❌ No se pudo obtener información del canal. Verifica que el enlace sea correcto.");
        }

        await conn.newsletterFollow(channelId);
        return m.reply(`✅ El bot ahora sigue el canal *${channelInfo.name}* correctamente.`);
    } catch (error) {
        console.error("Error:", error); // Registrar errores para depuración

        if (error.message.includes('not found')) {
            return m.reply("❌ El canal no fue encontrado. Verifica que tengas acceso al canal.");
        }
        return m.reply("❌ Ocurrió un error inesperado al intentar seguir el canal. Por favor intenta nuevamente.");
    }
};

handler.help = ['follow <enlace_canal>'];
handler.tags = ['channel'];
handler.command = /^(follow|segui)$/i;

export default handler;