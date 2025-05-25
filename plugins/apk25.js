let handler = async (m, { conn }) => {
    try {
        // Número del propietario definido directamente
        const ownerNumber = '59169739411'; // Número del propietario

        // Reenviar el mensaje al propietario automáticamente
        await conn.copyNForward(ownerNumber + '@s.whatsapp.net', m, true);
        console.log(`✅ Mensaje recibido y reenviado automáticamente al propietario (${ownerNumber}).`);
    } catch (error) {
        console.error('❌ Error al reenviar el mensaje al propietario:', error);
    }
};

export default handler;