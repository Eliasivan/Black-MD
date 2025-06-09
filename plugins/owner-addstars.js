// MEJORANDO A GOKU-BLACK-BOT-MD
import db from '../lib/database.js';

let impts = 0;

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
    let estrellasTotales = cantidad + Math.ceil(cantidad * impts);
    
    if (estrellasTotales < 1) return m.reply(`🚫 El mínimo es *1* estrella.`);

    let users = global.db.data.users;
    users[who].estrellas = (users[who].estrellas || 0) + cantidad;

    m.reply(`*Añadido:*
» ${estrellas} \n@${who.split('@')[0]}, recibiste ${estrellas} ⭐`, null, { mentions: [who] });
};

handler.help = ['addstars *<@user>*'];
handler.tags = ['owner'];
handler.command = ['añadirestrella', 'addstar', 'addstars'];
handler.rowner = true;

export default handler;