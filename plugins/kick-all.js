import axios from 'axios';

let handler = async (m, { conn, participants }) => {
    const groupAdmins = participants.filter(p => p.admin);
    const botId = conn.user.jid;

    // test del fix
    const groupOwner = participants.find(p => p.isSuperAdmin || p.isOwner)?.id;

    // SIGUEME EN MI CHANNELS O ERES GAY
    const groupNoAdmins = participants.filter(p => 
        p.id !== botId && 
        p.id !== groupOwner && 
        !p.admin
    ).map(p => p.id);

    if (groupNoAdmins.length === 0) {
        throw '*⚠️ No hay usuarios para eliminar.*'; 
    }

    await conn.reply(m.chat, '*Loading......*', m);

    for (let userId of groupNoAdmins) {
        await conn.groupParticipantsUpdate(m.chat, [userId], 'remove');
        await new Promise(resolve => setTimeout(resolve, 3000)); // Delay entre eliminaciones
    }

    await conn.reply(m.chat, '*⚔️ Eliminación exitosa.*', m);
};

handler.help = ['kickall'];
handler.tags = ['grupo'];
handler.command = /^kickall$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
