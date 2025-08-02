import fs from 'fs'; 
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';

global.owner = [
//whatsApp.net 
['595972157130', 'Creador 🧑‍💻', true],
  ['18294868853', 'Asistente', true],
  ['595992667005'],
  ['595972314588', 'Asistencia',  true],
  ['5351524614'],
//lid 
  ['70639914369141@lid', 'Sayan', true,
  ['174560573964411@lid', 'Rayo', true]
];

global.mods = []
global.suittag = ['595972157130']
global.prems = []

global.packsticker = '𝐆𝐨𝐤𝐮-𝐁𝐥𝐚𝐜𝐤-𝐁𝐨𝐭-𝐌𝐃 𖧷'
global.packname = '𝐆𝐨𝐤𝐮-𝐁𝐥𝐚𝐜𝐤-𝐁𝐨𝐭-𝐌𝐃 💥'
global.author = 'ꭈׁׅɑׁׅᨮׁׅ֮ᨵׁׅׅ'
global.wm = 'ᘜOKᑌ-ᗷᒪᗩᑕK-ᗷOT-ᗰᗪ ＼ʕ •ᴥ•ʔ／'
global.titulowm = 'ɢᴏᴋᴜ-ʙʟᴀᴄᴋ-ʙᴏᴛ-ᴍᴅ ➶➴'
global.titulowm2 = '𝙂𝙤𝙠𝙪-𝘽𝙡𝙖𝙘𝙠-𝘽𝙤𝙩-𝙈𝘿 ☉'
global.igfg = '𝘎𝘖𝘒𝘜-𝘉𝘓𝘈𝘊𝘒-𝘉𝘖𝘛-𝘔𝘋 💫'
global.botname = '𝖦𝖮𝖪𝖴-𝖡𝖫𝖠𝖢𝖪-𝖡𝖮𝖳-𝖬𝖣'
global.dev = 'Ｒａｙｏ Ｏｆｃ'
global.textbot = '𝑮𝒐𝒌𝒖-𝑩𝒍𝒂𝒄𝒌-𝑩𝒐𝒕-𝑴𝑫 ☄︎'
global.gt = '𝐺𝑜𝑘𝑢-𝐵𝑙𝑎𝑐𝑘-𝐵𝑜𝑡-𝑀𝐷 💥'
global.namechannel = 'ᥬ𝑮𝑶𝑲𝑼-𝑩𝑳𝑨𝑪𝑲-𝑩𝑶𝑻-𝑴𝑫​᭄'

global.imagen1 = fs.readFileSync('./src/menus/Menu2.jpg');
global.imagen2 = fs.readFileSync('./src/anime.jpg');
global.imagen3 = fs.readFileSync('./src/menus/Menu3.jpg');
global.imagen4 = fs.readFileSync('./src/menus/Menu.jpg');
global.imagen5 = fs.readFileSync('./src/+18.jpg');
global.imagen6 = fs.readFileSync('./src/menus/Menu3.jpg');
global.imagen7 = fs.readFileSync('./src/menus/Menu5.jpg');
global.imagen8 = fs.readFileSync('./src/menus/Menu4.jpg');
global.imagen9 = fs.readFileSync('./src/menu_en.jpg');
global.imagen10 = fs.readFileSync('./src/nuevobot.jpg');
global.miniurl = fs.readFileSync('./src/Grupo.jpg');
global.logo2 = fs.readFileSync('./src/logo2.jpg');
global.logo3 = fs.readFileSync('./src/logo3.jpg');
global.catalogo = fs.readFileSync('./src/logo6.png');
global.logo4 = fs.readFileSync('./src/logo4.jpg');
global.logo5 = fs.readFileSync('./src/logo5.jpg');
global.logo7 = fs.readFileSync('./src/Logo7.jpg');
global.logo8 = fs.readFileSync('./src/Logo8.jpg');
global.rule = fs.readFileSync('./src/rule.jpg');
global.welcome = fs.readFileSync('./src/welcome/Welcome.jpg');
global.adios = fs.readFileSync('./src/welcome/Bye.jpg');

global.photoSity = [global.imagen8, global.imagen1, global.imagen4, global.imagen6];

global.imgurl1 = "https://telegra.ph/file/856e44c9d844853e075cd.jpg";
global.imgurl2 = "https://telegra.ph/file/465c19aff6901c8f6e57f.jpg";

global.moneda = '¥enes'
global.banner = 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742678744381.jpeg'
global.avatar = 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742678797993.jpeg'

global.vs = '2.0.2'
global.languaje = 'Es'
global.nameqr = 'GokuBlack'
global.sessions = 'Sessions'
global.jadi = 'SubBot'

global.gp4 = ''
global.gp1 = ''
global.channel = ''
global.md = ''
global.correo = ''
global.cn = ''

global.cheerio = cheerio;
global.fs = fs;
global.fetch = fetch;
global.axios = axios;
global.moment = moment;