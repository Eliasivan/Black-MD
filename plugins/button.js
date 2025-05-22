/*no funciona:(*/
const handler = async (m, { conn, participants, mentionedJid }) => {
    // Verificamos si el comando fue usado en un grupo
    if (!m.isGroup) return m.reply('❌ Este comando solo se puede usar en grupos.');

    // Verificamos si el usuario que ejecuta el comando es administrador
    const groupMetadata = await conn.groupMetadata(m.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === m.sender && p.admin);
    if (!isAdmin) return m.reply('❌ Necesitas ser administrador para usar este comando.');

    // Verificamos si el bot tiene permisos de administrador
    const botAdmin = groupMetadata.participants.find(p => p.id === conn.user.jid && p.admin);
    if (!botAdmin) return m.reply('❌ No puedo ejecutar este comando porque no soy administrador.');

    // Verificamos si se mencionó a alguien
    if (!mentionedJid || mentionedJid.length === 0) {
        return m.reply('❌ Debes mencionar al usuario que deseas eliminar usando @usuario.');
    }

    // Obtenemos el ID del usuario mencionado
    const target = mentionedJid[0];

    // Verificamos si el objetivo es un administrador
    const targetParticipant = participants.find(p => p.id === target);
    if (targetParticipant && targetParticipant.admin) {
        return m.reply('❌ No puedes eliminar a otro administrador.');
    }

    // Intentamos eliminar al usuario
    try {
        await conn.groupParticipantsUpdate(m.chat, [target], 'remove'); // 'remove' para eliminar del grupo
        m.reply(`✅ El usuario @${target.split('@')[0]} ha sido eliminado del grupo.`, null, {
            mentions: [target],
        });
    } catch (error) {
        console.error(error);
        m.reply('❌ No se pudo eliminar al usuario. Verifica si tengo permisos de administrador.');
    }
};

handler.help = ['aniquilar @usuario']; // Ayuda para el comando
handler.tags = ['group']; // Categoría
handler.command = /^(aniquilar|ejecutar)$/i; // Comandos válidos para activar este handler
handler.admin = true; // Solo administradores pueden usar este comando
handler.group = true; // Solo se puede usar en grupos

export default handler;