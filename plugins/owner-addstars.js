// MEJORANDO A GOKU-BLACK-BOT-MD
import db from '../lib/database.js';

let handler = async (m, { conn, text }) => {
    let who;
    if (m.isGroup) {
        if (m.mentionedJid.length > 0) {
            who = m.mentionedJid[0];
        } else {
            const quoted = m.quoted ? m.quoted.sender : null;
            who = quoted ? quoted : m.chat;
        }
    } else {
        who = m.chat;
    }

    if (!who) return m.reply(`🌟 Por favor, menciona al usuario o cita un mensaje para añadir estrellas.`);
    
    let txt = text.replace('@' + who.split`@`[0], '').trim();
    if (!txt) return m.reply(`🌟 Por favor, ingresa la cantidad de estrellas que deseas añadir.`);
    if (isNaN(txt)) return m.reply(`🚫 Sólo se permiten números.`);
    
    let cantidad = parseInt(txt);
    if (cantidad < 1) return m.reply(`🚫 La cantidad mínima es *1* estrella.`);
    
    let users = global.db.data.users;
    if (!users[who]) return m.reply(`🚫 El usuario no está registrado en la base de datos.`);

    users[who].estrellas = (users[who].estrellas || 0) + cantidad;

    m.reply(`⭐ *Estrellas añadidas:*
» ${cantidad} estrella(s)
🌟 @${who.split('@')[0]} ahora tiene un total de *${users[who].estrellas}* estrellas.`, null, { mentions: [who] });
};

handler.help = ['addstars *<@user>*'];
handler.tags = ['owner'];
handler.command = ['añadirestrella', 'addstar', 'addstars'];
handler.rowner = true;

export default handler;