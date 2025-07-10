import db from '../lib/database.js'

let handler = async (m, { args }) => {
    let user = global.db.data.users[m.sender]
    if (!args[0]) return m.reply(`💴 Ingresa la cantidad de *Yenes* que deseas retirar.`)
    if (args[0] == 'all') {
        let count = parseInt(user.bank || 0)
        user.bank -= count * 1
        user.yen = (user.yen || 0) + count * 1
        await m.reply(`💴 Retiraste *${count} Yenes* del banco. Ahora podrás usarlos, pero también estarán expuestos a robos.`)
        return true
    }
    if (!Number(args[0])) return m.reply(`❌ Debes retirar una cantidad válida.\n> Ejemplo 1 » *#retirar 25000*\n> Ejemplo 2 » *#retirar all*`)
    let count = parseInt(args[0])
    if (!user.bank || user.bank < count) {
        return m.reply(`❌ No tienes suficientes Yenes en el banco. Actualmente tienes *${user.bank || 0} Yenes*.`)
    }
    user.bank -= count * 1
    user.yen = (user.yen || 0) + count * 1
    await m.reply(`💴 Retiraste *${count} Yenes* del banco. Ahora podrás usarlos, pero también estarán expuestos a robos.`)
}

handler.help = ['retirar']
handler.tags = ['rpg']
handler.command = ['withdraw', 'retirar', 'with']
handler.group = true
handler.register = true

export default handler