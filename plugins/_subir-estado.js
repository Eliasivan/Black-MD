import { promises as fsPromises } from 'fs';
import ws from 'ws';

const fs = { ...fsPromises };

let handler = async (m, { conn: _envio, command }) => {
    const isCommandBots = /^(bots|listjadibots|subbots)$/i.test(command);
    const isCommandConectados = /^(conectados)$/i.test(command);

    switch (true) {
        case isCommandBots:
            const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
            const totalUsers = users.length;
            const responseMessageBots = users.length === 0
                ? `No hay bots conectados en este momento.`
                : `*Usuarios Conectados:*\n\n` +
                  users.map((v, i) => `• 「 ${i + 1} 」 ${v.user.name || 'Sub'} (${v === global.conn ? 'Bot Oficial' : 'Sub'})`).join('\n') +
                  `\n\n*Total de Bots en el Grupo:* ${totalUsers}`;

            await _envio.sendMessage(m.chat, { text: responseMessageBots }, { quoted: m });
            break;

        case isCommandConectados:
            const allConns = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
            const responseMessageConectados = allConns.length === 0
                ? `No hay usuarios conectados en este momento.`
                : `*Conectados:*\n\n` +
                  allConns.map((v, i) => `• 「 ${i + 1} 」 Nombre: ${v.user.name || 'Desconocido'}, Número: ${v.user.jid.replace(/[^0-9]/g, '')}`).join('\n');

            await _envio.sendMessage(m.chat, { text: responseMessageConectados }, { quoted: m });
            break;

        default:
            await _envio.sendMessage(m.chat, { text: `Comando no reconocido.` }, { quoted: m });
    }
};

handler.command = ['bots', 'listjadibots', 'subbots', 'conectados'];
export default handler;