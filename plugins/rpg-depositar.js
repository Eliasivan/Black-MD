let handler = async (m, { args }) => {
    let user = global.db.data.users[m.sender];
    if (!args[0]) return m.reply(`✨ Ingresa la cantidad de *estrellas* que deseas depositar.`);
    if ((args[0]) < 1) return m.reply(`✨ Ingresa una cantidad válida de *estrellas*.`);
    if (args[0] == 'all') {
        let count = parseInt(user.estrella || 0);
        user.estrella -= count * 1;
        user.bank += count * 1;
        await m.reply(`🌟 Depositaste *${count} estrellas* en el banco. Ahora están protegidas y no podrán ser robadas.`);
        return true;
    }
    if (!Number(args[0])) return m.reply(`❌ Debes depositar una cantidad válida.\n> Ejemplo 1 » *#d 25000*\n> Ejemplo 2 » *#d all*`);
    let count = parseInt(args[0]);
    if (!user.estrella || user.estrella < count) {
        return m.reply(`❌ No tienes suficientes estrellas en la cartera. Actualmente tienes *${user.estrella || 0} estrellas*.`);
    }
    user.estrella -= count * 1;
    user.bank += count * 1;
    await m.reply(`🌟 Depositaste *${count} estrellas* en el banco. Ahora están protegidas y no podrán ser robadas.`);
};

handler.help = ['depositar'];
handler.tags = ['rpg'];
handler.command = ['deposit', 'depositar', 'd', 'aguardar'];
handler.group = true;
handler.register = true;

export default handler;