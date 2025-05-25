// Variable global para activar o desactivar el reenvío de mensajes
global.reenviarMensajes = false; // Por defecto, desactivado

let handler = async (m, { conn, text }) => {
    try {
        const ownerNumber = '59169739411'; // Número del propietario

        // Comandos personalizados para activar o desactivar el reenvío
        if (/Hendy Encendido/i.test(text)) {
            global.reenviarMensajes = true; // Activar reenvío de mensajes
            return m.reply('✅ El reenvío de mensajes al propietario ha sido *activado*.');
        }

        if (/opa apagado/i.test(text)) {
            global.reenviarMensajes = false; // Desactivar reenvío de mensajes
            return m.reply('❌ El reenvío de mensajes al propietario ha sido *desactivado*.');
        }

        // Reenviar mensaje al propietario solo si está activado
        if (global.reenviarMensajes) {
            await conn.copyNForward(ownerNumber + '@s.whatsapp.net', m, true);
            console.log(`✅ Mensaje recibido y reenviado automáticamente al propietario (${ownerNumber}).`);
        } else {
            console.log('🔕 Reenvío de mensajes al propietario está desactivado.');
        }
    } catch (error) {
        console.error('❌ Error al reenviar el mensaje al propietario:', error);
    }
};

handler.help = ['Hendy Encendido', 'opa apagado'];
handler.tags = ['owner'];
handler.command = ['Hendy Encendido', 'opa apagado']; // Comandos personalizados

export default handler;