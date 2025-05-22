const handler = async (m, { conn, participants, args }) => {
    // Verificamos si el comando fue usado en un grupo
    if (!m.isGroup) return m.reply('❌ Este comando solo se puede usar en grupos.');

    // Verificamos si el usuario que ejecuta el comando es administrador
    const groupMetadata = await conn.groupMetadata(m.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === m.sender && p.admin);
    if (!isAdmin) return m.reply('❌ Necesitas ser administrador para usar este comando.');

    // Verificamos si el bot tiene permisos de administrador
    const botAdmin = groupMetadata.participants.find(p => p.id === conn.user.jid && p.admin);
    if (!botAdmin) return m.reply('❌ No puedo ejecutar este comando porque no soy administrador.');

    // Verificamos si se proporcionó un LID o una mención
    if (!args[0] && !m.mentionedJid?.length) {
        return m.reply('❌ Debes proporcionar un Lightweight ID (LID) o mencionar al usuario que deseas eliminar.');
    }

    // Obtenemos el objetivo (puede ser LID o mención)
    const target = args[0] || (m.mentionedJid.length > 0 && m.mentionedJid[0]);

    // Verificamos si el objetivo es válido
    const targetParticipant = participants.find(p => p.id === target || p.id.endsWith(target));
    if (!targetParticipant) {
        return m.reply('❌ No se encontró al usuario en el grupo. Verifica el LID o la mención.');
    }

    // Verificamos si el objetivo es un administrador
    if (targetParticipant.admin) {
        return m.reply('❌ No puedes eliminar a otro administrador.');
    }

    // Intentamos eliminar al usuario
    try {
        await conn.groupParticipantsUpdate(m.chat, [targetParticipant.id], 'remove'); // 'remove' para eliminar del grupo
        m.reply(`✅ El usuario @${targetParticipant.id.split('@')[0]} ha sido eliminado del grupo.`, null, {
            mentions: [targetParticipant.id],
        });
    } catch (error) {
        console.error(error);
        m.reply('❌ No se pudo eliminar al usuario. Verifica si tengo permisos de administrador.');
    }
};

handler.help = ['dan <LID> | @usuario']; // Ayuda para el comando
handler.tags = ['group']; // Categoría
handler.command = /^(dan|eje)$/i; // Comandos válidos para activar este handler
handler.admin = true; // Solo administradores pueden usar este comando
handler.group = true; // Solo se puede usar en grupos

export default handler;