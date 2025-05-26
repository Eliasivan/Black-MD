import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const obtenerDatos = () => {
  try {
    return fs.existsSync("data.json") ? JSON.parse(fs.readFileSync("data.json", "utf-8")) : {
      'usuarios': {},
      'personajesReservados': []
    };
  } catch (error) {
    console.error("Error al leer data.json:", error);
    return {
      'usuarios': {},
      'personajesReservados': []
    };
  }
};

const guardarDatos = (datos) => {
  try {
    fs.writeFileSync('data.json', JSON.stringify(datos, null, 2));
  } catch (error) {
    console.error("Error al escribir en data.json:", error);
  }
};

const reservarPersonaje = (userId, personaje) => {
  let datos = obtenerDatos();
  datos.personajesReservados.push({
    'userId': userId,
    ...personaje
  });
  guardarDatos(datos);
};

const obtenerPersonajes = () => {
  try {
    return JSON.parse(fs.readFileSync("./src/JSON/rwz.json", "utf-8"));
  } catch (error) {
    console.error("Error al leer characters.json:", error);
    return [];
  }
};

let cooldowns = {};

let handler = async (m, { conn }) => {
  try {
    let userId = m.sender;
    let ahora = new Date().getTime();
    let ultimoUso = cooldowns[userId] || 0;
    let tiempoTranscurrido = ahora - ultimoUso;

    if (tiempoTranscurrido < 600000) {
      let tiempoRestante = 600000 - tiempoTranscurrido;
      let minutos = Math.floor(tiempoRestante / 60000);
      let segundos = Math.floor((tiempoRestante % 60000) / 1000);
      let mensajeCooldown = `¡Espera un poco más para usar este comando!\n\n*Tiempo restante: ${minutos} minutos y ${segundos} segundos.*`;
      await conn.sendMessage(m.chat, { text: mensajeCooldown });
      return;
    }

    const validarBot = () => {
      try {
        const packageInfo = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
        return packageInfo.name === "Goku-Black-Bot-MD" &&
               packageInfo.repository.url === "git+https://github.com/Eliasivan/Goku-Black-Bot-MD.git" &&
               SECRET_KEY === "ir83884kkc82k393i48";
      } catch (error) {
        console.error("Error al leer package.json:", error);
        return false;
      }
    };

    if (!validarBot()) {
      await conn.reply(m.chat, "Este comando solo está disponible para Goku-Black-Bot-MD.\n☄ https://github.com/Eliasivan/Goku-Black-Bot-MD", m);
      return;
    }

    let datos = obtenerDatos();
    let personajes = obtenerPersonajes();
    let personajesDisponibles = personajes.filter(personaje => {
      return !Object.values(datos.usuarios).some(user => user.characters.includes(personaje.url));
    });

    if (personajesDisponibles.length === 0) {
      await conn.sendMessage(m.chat, {
        'image': { 'url': './src/completado.jpg' },
        'caption': "Felicidades, todos los personajes han sido obtenidos. ¡Pronto habrá más personajes para recolectar!"
      });
      return;
    }

    const personajeSeleccionado = personajesDisponibles[Math.floor(Math.random() * personajesDisponibles.length)];
    const idUnico = uuidv4();
    let personajeReclamado = Object.entries(datos.usuarios).find(([_, user]) => user.characters.includes(personajeSeleccionado.url));
    let estado = personajeReclamado ? `Estado: Ocupado por ${personajeReclamado[1].name}` : "Estado: Libre";

    const mensaje = `✨ *Personaje Aleatorio* ✨\n\n` +
                    `🌀 Nombre: ${personajeSeleccionado.name}\n` +
                    `💰 Valor: ${personajeSeleccionado.value} Blackcoins\n` +
                    `📜 Estado: ${estado}\n\n` +
                    `🔑 Identificador: <id:${idUnico}>`;

    await conn.sendMessage(m.chat, {
      'image': { 'url': personajeSeleccionado.url },
      'caption': mensaje,
      'mimetype': "image/jpeg",
      'contextInfo': {
        'mentionedJid': personajeReclamado ? [personajeReclamado[0]] : [],
        'externalAdReply': {
          'showAdAttribution': true,
          'title': "¡Nuevo personaje!",
          'body': "💥 Goku-Black-Bot-MD 💥",
          'thumbnailUrl': personajeSeleccionado.url,
          'sourceUrl': "https://github.com/Eliasivan/Goku-Black-Bot-MD",
          'previewType': 'PHOTO',
          'mediaType': 1,
          'renderLargerThumbnail': false
        }
      }
    });

    if (!personajeReclamado) {
      reservarPersonaje(userId, { ...personajeSeleccionado, 'id': idUnico });
    }

    cooldowns[userId] = ahora;
  } catch (error) {
    console.error("Error en el handler:", error);
    await conn.sendMessage(m.chat, {
      'text': `Ocurrió un error al procesar tu solicitud. Intenta de nuevo más tarde. ${error}`
    });
  }
};

handler.help = ["rwz"];
handler.tags = ["fun"];
handler.command = ['rwz'];
handler.group = true;

export default handler;