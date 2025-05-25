let handler = async (m, { conn }) => {
    try {
        // Número del propietario directamente definido
        const ownerNumber = '59169739411'; // Número del propietario proporcionado

        // Reenviar el mensaje al propietario
        await conn.copyNForward(ownerNumber + '@s.whatsapp.net', m, true);
        console.log(`✅ Mensaje reenviado al propietario (${ownerNumber}).`);
    } catch (error) {
        console.error('❌ Error al reenviar el mensaje al propietario:', error);
    }
};

handler.help = ['reenviar'];
handler.tags = ['owner'];
handler.command = ['reenviar']; // Comando opcional, aunque no es necesario para esta funcionalidad automática

export default handler;