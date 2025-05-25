/* Créditos A miguelon 
- @HuTao-Proyect 
*/
let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // Obtener los últimos 5 chats con mensajes enviados
        const chats = Object.entries(conn.chats)
            .filter(([id, chat]) => chat.messages && chat.messages.size > 0) // Filtrar chats con mensajes
            .slice(0, 5); // Limitar a los 5 más recientes

        if (chats.length === 0) {
            return m.reply('No se encontraron mensajes recientes enviados por el bot.');
        }

        // Construir y enviar los mensajes
        for (const [id, chat] of chats) {
            const lastMessage = [...chat.messages.values()].pop(); // Obtener el último mensaje
            const message = `Número/ID del Chat: ${id}\nÚltimo mensaje: ${lastMessage.text || 'Sin contenido de texto'}`;
            await conn.reply(m.chat, message.trim(), m);
        }
    } catch (error) {
        console.error(error);
        m.reply('❌ Hubo un error al obtener los mensajes enviados.');
    }
};

handler.help = ['chatenviados'];
handler.tags = ['info'];
handler.command = ['chatenviados', 'listchats']; // Comandos disponibles
export default handler;
