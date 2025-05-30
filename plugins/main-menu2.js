let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    let user = global.db.data.users[userId];
    let name = conn.getName(userId);
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    let totalreg = Object.keys(global.db.data.users).length;
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length;

    let txt = `
🌟 Hola, ${name} 🌟

📊 *Estadísticas del Bot*:
- Usuarios registrados: ${totalreg}
- Comandos disponibles: ${totalCommands}
- Tiempo activo: ${uptime}

✨ Usa los siguientes comandos para reproducir audios:
∘ _Hola_
∘ _Noche de paz_
∘ _Buenos días_
∘ _Fiesta del admin_
∘ _Ara ara_
∘ _Viernes_
∘ _Mierda de Bot_
∘ _Me olvidé_
∘ _Baneado_
∘ _Feliz navidad_
∘ _A nadie le importa_
∘ _Sexo_
∘ _Vete a la vrg_
∘ _Te amo_
∘ _Yamete_
∘ _Quien es tu sempai botsito 7w7_
∘ _Bañate_
∘ _Marica quien_
∘ _Es puto_
∘ _Onichan_
∘ _Bot puto_
∘ _Feliz cumpleaños_
∘ _Me voy_
`.trim();

    await conn.sendMessage(m.chat, { 
        text: txt,
        contextInfo: {
            mentionedJid: [m.sender, userId],
            isForwarded: true,
            forwardingScore: 999,
            externalAdReply: {
                title: "Menú de Audios",
                body: "Comandos disponibles para reproducir audios",
                thumbnailUrl: './Menu2.jpg',
                sourceUrl: 'https://github.com/Eliasivan/Goku-Black-Bot-MD',
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: true,
            },
        },
    }, { quoted: m });
};

handler.help = ['menu2'];
handler.tags = ['main'];
handler.command = ['menu2'];

export default handler;

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
}