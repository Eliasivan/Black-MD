let linkRegex = /https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;

let handler = async (m, { conn, text, isOwner }) => {
    if (!text) return m.reply(`🚫 Debes enviar una invitación para que *${botname}* se una al grupo.`);

    let [_, code] = text.match(linkRegex) || [];
    if (!code) return m.reply(`❌ Enlace de invitación no válido.`);

    if (isOwner) {
        await conn.groupAcceptInvite(code)
            .then(async groupId => {
                m.reply(`✅ Me he unido exitosamente al grupo.`);
                const ONE_DAY = 24 * 60 * 60 * 1000;
                setTimeout(async () => {
                    try {
                        await conn.groupLeave(groupId);
                        console.log(`⏳ Salí automáticamente del grupo ${groupId} después de 24 horas.`);
                    } catch (e) {
                        console.error(`❗ Error al salir automáticamente del grupo:`, e);
                    }
                }, ONE_DAY);
            })
            .catch(err => m.reply(`⚠️ Error al unirme al grupo.`));
    } else {
        let message = `📩 Invitación a un grupo:\n${text}\n\n👤 Por: @${m.sender.split('@')[0]}`;
        await conn.sendMessage(`${suittag}` + '@s.whatsapp.net', { text: message, mentions: [m.sender] }, { quoted: m });
        m.reply(`📬 El link del grupo ha sido enviado al propietario. Gracias por tu invitación. ฅ^•ﻌ•^ฅ`);
    }
};

handler.help = ['invite'];
handler.tags = ['owner', 'tools'];
handler.command = ['invite', 'join'];

export default handler;
