import axios from 'axios'
import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import moment from 'moment-timezone'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, args, usedPrefix, command }) {
    let user = global.db.data.users[m.sender]
    let name2 = conn.getName(m.sender)
    let whe = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
    let perfil = await conn.profilePictureUrl(whe, 'image').catch(_ => 'https://qu.ax/FGSG.jpg')

    if (user.registered === true) {
        return m.reply(`*『✦』Ya estás registrado, para volver a registrarte, usa el comando: #unreg*`)
    }

    if (!Reg.test(text)) return m.reply(`*『✦』El comando ingresado es incorrecto, uselo de la siguiente manera:*\n\n#reg *Nombre.edad*\n\n\`\`\`Ejemplo:\`\`\`\n#reg *${name2}.18*`)

    let [_, name, splitter, age] = text.match(Reg)
    if (!name) return m.reply('*『✦』No puedes registrarte sin nombre, el nombre es obligatorio. Inténtelo de nuevo.*')
    if (!age) return m.reply('*『✦』No puedes registrarte sin la edad, la edad es opcional. Inténtelo de nuevo.*')
    if (name.length >= 100) return m.reply('*『✦』El nombre no debe tener más de 30 caracteres.*')

    age = parseInt(age)
    if (age > 1000) return m.reply('⏤͟͟͞͞𝑳𝒂 𝑬𝒅𝒂𝒅 𝒊𝒏𝒈𝒓𝒆𝒔𝒂𝒅𝒂 𝑬𝒔 𝒊𝒏𝒄𝒐𝒓𝒓𝒆𝒄𝒕𝒂⏤͟͟͞͞')
    if (age < 5) return m.reply('⏤͟͟͞͞𝑳𝒂 𝑬𝒅𝒂𝒅 𝒊𝒏𝒈𝒓𝒆𝒔𝒂𝒅𝒂 𝑬𝒔 𝒊𝒏𝒄𝒐𝒓𝒓𝒆𝒄𝒕𝒂⏤͟͟͞͞')

    user.name = name.trim()
    user.age = age
    user.regTime = +new Date
    user.registered = true
    global.db.data.users[m.sender].money += 600
    global.db.data.users[m.sender].estrellas += 10
    global.db.data.users[m.sender].exp += 245
    global.db.data.users[m.sender].joincount += 5    

    let who;
    if (m.quoted && m.quoted.sender) {
        who = m.quoted.sender;
    } else {
        who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    }

let sn = createHash('md5').update(m.sender).digest('hex');
let regbot = `
╭═══꒰ঌ🌱『 𝙂𝙊𝙆𝙐 𝘽𝙇𝘼𝘾𝙆 𝘽𝙊𝙏 』🌱໒꒱═══╮  
🌟 *¡𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙾 𝙲𝙾𝙼𝙿𝙇𝙴𝚃𝙾 𝙴𝚇𝙸𝚃𝙾𝚂𝙊!* 🌟  
╰═══❀⭑𖤐𓏲⋆｡˚🌷˚｡⋆𓆩♡𓆪⭑❀═══╯

╭─────────────𓏲⭑🗝️⭑𓏲─────────────╮  
⛓️ ⤷ 𝙉𝙤𝙢𝙗𝙧𝙚: *${name}*  
🌫️ ⤷ 𝙀𝙙𝙖𝙙: *${age} años*  
╰──────────────────────────────╯

📝 ɢʀᴀᴄɪᴀꜱ ᴘᴏʀ ʀᴇɢɪꜱᴛʀᴀʀᴛᴇ ᵎ  
╭─⊹𓆩📋𓆪⊹────────────────────╮  
𖥔 Usa *.menu* para ver el menú de comandos  
╰─────────────────────────────╯

🌈 𝗥𝗘𝗖𝗢𝗠𝗣𝗘𝗡𝗦𝗔𝗦 💝  
╭────────────༶⋆｡˚⭑˚｡⋆༶────────────╮  
🍀 *${estrellas}* ➤ 40  
🪙 *Experiencia* ➤ 300  
💸 *Tokens* ➤ 20  
╰────────────────────────────────╯

╭⭑♥⭑ (っ◔◡◔)っ Mensaje de Goku black ⭑♥⭑╮  
🎈 ¡Gracias por usar a *Goku Black Bot*!  
✨ Sígueme en el canal para no perderte nada:  
> https://whatsapp.com/channel/0029VaYh3Zm4dTnQKQ3VLT0h  
╰─────────𖤐𓍯💫𓍯𖤐─────────╯`


await conn.sendMessage(m.chat, {
    text: regbot,
    contextInfo: {
        externalAdReply: {
            title: '⊱『✅𝆺𝅥 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗔𝗗𝗢(𝗔) 𝆹𝅥✅』⊰',
            thumbnailUrl: 'https://qu.ax/FGSG.jpg',
            mediaType: 1,
            body: wm,
        }
    }
}, { quoted: m });



/*    await m.react('📪')
  await conn.sendMessage(m.chat, {
           text: regbot, 
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,                      
                containsAutoReply: true,
                title: '⊱『✅𝆺𝅥 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗔𝗗𝗢(𝗔) 𝆹𝅥✅』⊰',  
                body: dev,  
                containsAutoReply: true,
                showAdAttribution: true,
                mediaType: 1, 
                thumbnailUrl: 'https://qu.ax/FGSG.jpg' }}}, {quoted: m})
*/

let chtxt = `ੈ₊˚༅༴│↷◌⁺˖ 🌸 *𝐆𝐎𝐊𝐔 - 𝐁𝐋𝐀𝐂𝐊* 🌸
🔥ੈ₊˚༅༴│.👥 *𝚄𝚜𝚎𝚛* » ${m.pushName || 'Anónimo'}  
🔥ੈ₊˚༅༴│.📇 *𝚅𝚎𝚛𝚒𝚏𝚒𝚌𝚊𝚌𝚒𝚘́𝚗* » ${user.name}  
🔥ੈ₊˚༅༴│.🍰 *𝙴𝚍𝚊𝚍* » ${user.age} años  
🔥ੈ₊˚༅༴│.⌨️ *𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚌𝚒𝚘𝚗* » ${user.descripcion}  
🔥ੈ₊˚༅༴│.🍬 *𝙽𝚞𝚖𝚎𝚛𝚘 𝚍𝚎 𝚛𝚎𝚐𝚒𝚜𝚝𝚛𝚘* »
⤷ ${sn}`;

    let channelID = '120363335626706839@newsletter';
        await conn.sendMessage(channelID, {
        text: chtxt,
        contextInfo: {
            externalAdReply: {
                title: "୧⍤⃝💐 𝐑͜͡𝐄͜͡𝐆͜͡𝐈͜͡𝐒͜͡𝐓͜͡𝐑͜͡𝐎͜͡  𝘾𝙊⃟𝙈𝙋𝙇𝙀᪵᪺𝙏⃨𝙊 ❛░⃟ ⃟°˟̫̫",
                body: '☠️ 𝑱𝒂𝒋𝒂, 𝒖𝒏 𝒏𝒖𝒆𝒗𝒐 𝒉𝒖𝒎𝒂𝒏𝒐 𝒆𝒏 𝒎𝒊 𝒃𝒂𝒔𝒆 𝒅𝒆 𝒅𝒂𝒕𝒐𝒔!',
                thumbnailUrl: perfil,
                sourceUrl: redes,
                mediaType: 1,
                showAdAttribution: false,
                renderLargerThumbnail: false
            }
        }
    }, { quoted: null });
};

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler