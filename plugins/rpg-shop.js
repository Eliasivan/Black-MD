const xpperestrella = 350;
const handler = async (m, { conn, command, args }) => {
    let count = command.replace(/^buy/i, '');
    count = count 
        ? /all/i.test(count) 
            ? Math.floor(global.db.data.users[m.sender].exp / xpperestrella) 
            : parseInt(count) 
        : args[0] 
            ? parseInt(args[0]) 
            : 1;
    count = Math.max(1, count);

    if (global.db.data.users[m.sender].exp >= xpperestrella * count) {
        global.db.data.users[m.sender].exp -= xpperestrella * count;
        global.db.data.users[m.sender].estrella = (global.db.data.users[m.sender].estrella || 0) + count;

        conn.reply(m.chat, `
╔═══════⩽✰⩾═══════╗
║    𝐍𝐨𝐭𝐚 𝐃𝐞 𝐏𝐚𝐠𝐨 
╠═══════⩽✰⩾═══════╝
║╭──────────────┄
║│ *Compra Nominal* : + ${count} 🌟
║│ *Gastado* : -${xpperestrella * count} XP
║╰──────────────┄
╚═══════⩽✰⩾═══════╝`, m);
    } else {
        conn.reply(m.chat, `❌ Lo siento, no tienes suficiente *XP* para comprar *${count}* estrellas 🌟`, m);
    }
};

handler.help = ['Buy', 'Buyall'];
handler.tags = ['economy'];
handler.command = ['buy', 'buyall'];
handler.group = true;
handler.register = true;

export default handler;