const handler = async (m, { conn, usedPrefix, args, isOwner, isAdmin, isROwner }) => {
    const chat = global.db.data.chats[m.chat] || {}; // Inicializa los ajustes del chat si no existen
    const bot = global.db.data.settings[conn.user.jid] || {}; // Configuración del bot si no existe
    const type = (args[0] || '').toLowerCase(); // Tipo de función
    let isEnable;

    if (args[1]?.toLowerCase() === 'on') {
        isEnable = true; // Activar función
    } else if (args[1]?.toLowerCase() === 'off') {
        isEnable = false; // Desactivar función
    } else {
        const estado = chat[type] || bot[type] ? '✓ Activado' : '✗ Desactivado';
        return conn.reply(
            m.chat,
            `❌ Uso incorrecto del comando.\n\nFormato: *${usedPrefix}${type} <on/off>*\nEjemplo: *${usedPrefix}${type} on*\n\n📋 Estado actual: *${estado}*`,
            m
        );
    }

    let isAll = false;

    // Verificación de permisos y activación/desactivación según el tipo
    switch (type) {
        case 'welcome':
        case 'bienvenida':
            if (!m.isGroup) {
                if (!isOwner) {
                    global.dfail('group', m, conn);
                    throw false;
                }
            } else if (!isAdmin) {
                global.dfail('admin', m, conn);
                throw false;
            }
            chat.welcome = isEnable;
            break;

        case 'detect':
        case 'avisos':
            if (!m.isGroup) {
                if (!isOwner) {
                    global.dfail('group', m, conn);
                    throw false;
                }
            } else if (!isAdmin) {
                global.dfail('admin', m, conn);
                throw false;
            }
            chat.detect = isEnable;
            break;

        case 'antidelete':
        case 'antieliminar':
        case 'delete':
            if (!m.isGroup) {
                if (!isOwner) {
                    global.dfail('group', m, conn);
                    throw false;
                }
            } else if (!isAdmin) {
                global.dfail('admin', m, conn);
                throw false;
            }
            chat.delete = isEnable;
            break;

        case 'antilink':
        case 'antienlace':
            if (!m.isGroup) {
                if (!isOwner) {
                    global.dfail('group', m, conn);
                    throw false;
                }
            } else if (!isAdmin) {
                global.dfail('admin', m, conn);
                throw false;
            }
            chat.antiLink = isEnable;
            break;

        case 'modohorny':
        case 'modocaliente':
        case 'modehorny':
            if (!m.isGroup) {
                if (!isOwner) {
                    global.dfail('group', m, conn);
                    throw false;
                }
            } else if (!isAdmin) {
                global.dfail('admin', m, conn);
                throw false;
            }
            chat.modohorny = isEnable;
            break;

        case 'autolevelup':
        case 'autonivel':
        case 'nivelautomatico':
            if (!m.isGroup) {
                if (!isOwner) {
                    global.dfail('group', m, conn);
                    throw false;
                }
            } else if (!isAdmin) {
                global.dfail('admin', m, conn);
                throw false;
            }
            chat.autolevelup = isEnable;
            break;

        case 'reaction':
        case 'reacciones':
            if (!m.isGroup) {
                if (!isOwner) {
                    global.dfail('group', m, conn);
                    throw false;
                }
            } else if (!isAdmin) {
                global.dfail('admin', m, conn);
                throw false;
            }
            chat.reaction = isEnable;
            break;

        case 'antitoxic':
            if (!m.isGroup) {
                if (!isOwner) {
                    global.dfail('group', m, conn);
                    throw false;
                }
            } else if (!isAdmin) {
                global.dfail('admin', m, conn);
                throw false;
            }
            chat.antitoxic = isEnable;
            break;

        case 'audios':
            if (!m.isGroup) {
                if (!isOwner) {
                    global.dfail('group', m, conn);
                    throw false;
                }
            } else if (!isAdmin) {
                global.dfail('admin', m, conn);
                throw false;
            }
            chat.audios = isEnable;
            break;

        case 'modoadmin':
        case 'soloadmin':
            if (!m.isGroup) {
                if (!isOwner) {
                    global.dfail('group', m, conn);
                    throw false;
                }
            } else if (!isAdmin) {
                global.dfail('admin', m, conn);
                throw false;
            }
            chat.modoadmin = isEnable;
            break;

        case 'antifake':
        case 'antiextranjeros':
            if (!m.isGroup) {
                if (!isOwner) {
                    global.dfail('group', m, conn);
                    throw false;
                }
            } else if (!isAdmin) {
                global.dfail('admin', m, conn);
                throw false;
            }
            chat.antifake = isEnable;
            break;

        default:
            return conn.reply(
                m.chat,
                `❌ La función *${type}* no es válida.\n\nUsa *${usedPrefix}help* para ver las funciones disponibles.`,
                m
            );
    }

    conn.reply(
        m.chat,
        `💫 *La función ${type} se ha ${isEnable ? 'activado' : 'desactivado'} correctamente.*`,
        m
    );
};

handler.help = ['<función> on', '<función> off'];
handler.tags = ['settings'];
handler.command = ['welcome', 'detect', 'antidelete', 'antilink', 'modohorny', 'autolevelup', 'reaction', 'antitoxic', 'audios', 'modoadmin', 'antifake']; // Lista de funciones

export default handler;