import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios'; 
import { savetube } from '../lib/yt-savetube.js';
import { ogmp3 } from '../lib/youtubedl.js';

const LimitAud = 725 * 1024 * 1024;
const LimitVid = 425 * 1024 * 1024;
const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;
const userCaptions = new Map();
const userRequests = {};

const handler = async (m, { conn, command, args, text, usedPrefix }) => {
  if (!text) {
    let txt = `乂  Y O U T U B E  -  D O W N L O A D E R\n\n` + `    ✎   *Uso incorrecto*\n` + `    ✎   *Ejemplo* : ${usedPrefix + command} Neverita\n\n` + `> *- ✎ Proporciona el nombre o enlace de YouTube*`;
    return conn.reply(m.chat, txt, m, rcanal);
  }
  
  if (userRequests[m.sender]) {
    let txt = `乂  Y O U T U B E  -  E R R O R\n\n` + `    ✗   *Descarga en progreso*\n\n` + `> *- ✎ @${m.sender.split('@')[0]} espera a que termine tu descarga actual*`;
    return conn.reply(m.chat, txt, m, rcanal);
  }
  
  userRequests[m.sender] = true;
  
  try {
    let videoIdToFind = text.match(youtubeRegexID) || null;
    const yt_play = await search(args.join(' ')); 
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1]);
    
    if (videoIdToFind) {
      const videoId = videoIdToFind[1];
      ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId);
    }
    
    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2;
    
    const tipoDescarga = command === 'play1' || command === 'musica' ? 'audio' : 
                         command === 'play2' ? 'video' : 
                         command === 'play3' ? 'audio (documento)' : 
                         command === 'play4' ? 'video (documento)' : '';
    
    let txt = `乂  Y O U T U B E  -  D O W N L O A D\n\n` + `    ✦   *Título* : ${yt_play[0].title}\n` + `    ✦   *Duración* : ${secondString(yt_play[0].duration.seconds)}\n` + `    ✦   *Tipo* : ${tipoDescarga}\n\n` + `> *- ✎ Preparando tu contenido, por favor espera...*`;
    
    await conn.sendMessage(m.chat, { 
      image: { url: yt_play[0].thumbnail }, 
      caption: txt 
    }, { quoted: m });

    const [input, qualityInput = command === 'play1' || command === 'musica' || command === 'play3' ? '320' : '720'] = text.split(' ');
    const audioQualities = ['64', '96', '128', '192', '256', '320'];
    const videoQualities = ['240', '360', '480', '720', '1080'];
    const isAudioCommand = command === 'play1' || command === 'musica' || command === 'play3';
    const selectedQuality = (isAudioCommand ? audioQualities : videoQualities).includes(qualityInput) ? qualityInput : (isAudioCommand ? '320' : '720');
    const isAudio = command.toLowerCase().includes('mp3') || command.toLowerCase().includes('audio');
    const format = isAudio ? 'mp3' : '720';

    const audioApis = [
      { url: () => savetube.download(yt_play[0].url, format), extract: (data) => ({ data: data.result.download, isDirect: false }) },
      { url: () => ogmp3.download(yt_play[0].url, selectedQuality, 'audio'), extract: (data) => ({ data: data.result.download, isDirect: false }) },
      { url: () => fetch(`https://api.dorratz.com/v3/ytdl?url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => { 
        const mp3 = data.medias.find(media => media.quality === "160kbps" && media.extension === "mp3");
        return { data: mp3.url, isDirect: false }}},
      { url: () => fetch(`https://api.neoxr.eu/api/youtube?url=${yt_play[0].url}&type=audio&quality=128kbps&apikey=GataDios`).then(res => res.json()), extract: (data) => ({ data: data.data.url, isDirect: false }) },
      { url: () => fetch(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${yt_play[0].url}&apikey=elrebelde21`).then(res => res.json()), extract: (data) => ({ data: data.result.dl_url, isDirect: false }) },
      { url: () => fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => ({ data: data.dl, isDirect: false }) },
      { url: () => fetch(`https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => ({ data: data.result.download.url, isDirect: false }) },
      { url: () => fetch(`https://exonity.tech/api/dl/playmp3?query=${yt_play[0].title}`).then(res => res.json()), extract: (data) => ({ data: data.result.download, isDirect: false }) }
    ];

    const videoApis = [
      { url: () => savetube.download(yt_play[0].url, '720'), extract: (data) => ({ data: data.result.download, isDirect: false }) },
      { url: () => ogmp3.download(yt_play[0].url, selectedQuality, 'video'), extract: (data) => ({ data: data.result.download, isDirect: false }) },
      { url: () => fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => ({ data: data.dl, isDirect: false }) },
      { url: () => fetch(`https://api.neoxr.eu/api/youtube?url=${yt_play[0].url}&type=video&quality=720p&apikey=GataDios`).then(res => res.json()), extract: (data) => ({ data: data.data.url, isDirect: false }) },
      { url: () => fetch(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${yt_play[0].url}&apikey=elrebelde21`).then(res => res.json()), extract: (data) => ({ data: data.result.dl_url, isDirect: false }) },
      { url: () => fetch(`https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => ({ data: data.result.download.url, isDirect: false }) },
      { url: () => fetch(`https://exonity.tech/api/dl/playmp4?query=${encodeURIComponent(yt_play[0].title)}`).then(res => res.json()), extract: (data) => ({ data: data.result.download, isDirect: false }) }
    ];

    const download = async (apis) => {
      let mediaData = null;
      let isDirect = false;
      for (const api of apis) {
        try {
          const data = await api.url();
          const { data: extractedData, isDirect: direct } = api.extract(data);
          if (extractedData) {
            const size = await getFileSize(extractedData);
            if (size >= 1024) {
              mediaData = extractedData;
              isDirect = direct;
              break;
            }
          }
        } catch (e) {
          console.log(`Error con API: ${e}`);
          continue;
        }
      }
      return { mediaData, isDirect };
    };

    if (command === 'play1' || command === 'musica') {
      const { mediaData, isDirect } = await download(audioApis);
      if (mediaData) {
        const fileSize = await getFileSize(mediaData);
        let txt = `乂  Y O U T U B E  -  M P 3\n\n` + `    ✔   *Título* : ${yt_play[0].title}\n` + `    ✔   *Duración* : ${secondString(yt_play[0].duration.seconds)}\n` + `    ✔   *Calidad* : ${selectedQuality}kbps\n\n` + `> *- ✎ Audio listo, enviando...*`;
        
        await conn.sendMessage(m.chat, { 
          image: { url: yt_play[0].thumbnail }, 
          caption: txt 
        }, { quoted: m });

        if (fileSize > LimitAud) {
          await conn.sendMessage(m.chat, { 
            document: isDirect ? mediaData : { url: mediaData }, 
            mimetype: 'audio/mpeg', 
            fileName: `${yt_play[0].title}.mp3` 
          }, { quoted: m });
        } else {
          await conn.sendMessage(m.chat, { 
            audio: isDirect ? mediaData : { url: mediaData }, 
            mimetype: 'audio/mpeg' 
          }, { quoted: m });
        }
      } else {
        let txt = `乂  Y O U T U B E  -  E R R O R\n\n` + `    ✗   *No se pudo descargar el audio*\n\n` + `> *- ✎ Intenta nuevamente más tarde*`;
        return conn.reply(m.chat, txt, m, rcanal);
      }
    }

    if (command === 'play2' || command === 'video') {
      const { mediaData, isDirect } = await download(videoApis);
      if (mediaData) {
        const fileSize = await getFileSize(mediaData);
        let txt = `乂  Y O U T U B E  -  M P 4\n\n` + `    ✔   *Título* : ${yt_play[0].title}\n` + `    ✔   *Duración* : ${secondString(yt_play[0].duration.seconds)}\n` + `    ✔   *Calidad* : ${selectedQuality}p\n\n` + `> *- 🎥 Video listo, enviando...*`;
        
        await conn.sendMessage(m.chat, { 
          image: { url: yt_play[0].thumbnail }, 
          caption: txt 
        }, { quoted: m });

        if (fileSize > LimitVid) {
          await conn.sendMessage(m.chat, { 
            document: isDirect ? mediaData : { url: mediaData },
            fileName: `${yt_play[0].title}.mp4`,
            mimetype: 'video/mp4'
          }, { quoted: m });
        } else {
          await conn.sendMessage(m.chat, { 
            video: isDirect ? mediaData : { url: mediaData },
            caption: `🎬 ${yt_play[0].title}`,
            thumbnail: await (await fetch(yt_play[0].thumbnail)).buffer()
          }, { quoted: m });
        }
      } else {
        let txt = `乂  Y O U T U B E  -  E R R O R\n\n` + `    ✗   *No se pudo descargar el video*\n\n` + `> *- ✎ Intenta nuevamente más tarde*`;
        return conn.reply(m.chat, txt, m, rcanal);
      }
    }

    if (command === 'play3' || command === 'playdoc') {
      const { mediaData, isDirect } = await download(audioApis);
      if (mediaData) {
        let txt = `乂  Y O U T U B E  -  D O C U M E N T O\n\n` + `    ✔   *Título* : ${yt_play[0].title}\n` + `    ✔   *Formato* : MP3 (Documento)\n\n` + `> *- ✎ Enviando como documento...*`;
        
        await conn.sendMessage(m.chat, { 
          image: { url: yt_play[0].thumbnail }, 
          caption: txt 
        }, { quoted: m });

        await conn.sendMessage(m.chat, { 
          document: isDirect ? mediaData : { url: mediaData },
          mimetype: 'audio/mpeg',
          fileName: `${yt_play[0].title}.mp3`
        }, { quoted: m });
      } else {
        let txt = `乂  Y O U T U B E  -  E R R O R\n\n` + `    ✗   *No se pudo descargar el audio*\n\n` + `> *- ✎ Intenta nuevamente más tarde*`;
        return conn.reply(m.chat, txt, m, rcanal);
      }
    }

    if (command === 'play4' || command === 'playdoc2') {
      const { mediaData, isDirect } = await download(videoApis);
      if (mediaData) {
        let txt = `乂  Y O U T U B E  -  D O C U M E N T O\n\n` + `    ✔   *Título* : ${yt_play[0].title}\n` + `    ✔   *Formato* : MP4 (Documento)\n\n` + `> *- ✎ Enviando como documento...*`;
        
        await conn.sendMessage(m.chat, { 
          image: { url: yt_play[0].thumbnail }, 
          caption: txt 
        }, { quoted: m });

        await conn.sendMessage(m.chat, { 
          document: isDirect ? mediaData : { url: mediaData },
          fileName: `${yt_play[0].title}.mp4`,
          mimetype: 'video/mp4'
        }, { quoted: m });
      } else {
        let txt = `乂  Y O U T U B E  -  E R R O R\n\n` + `    ✗   *No se pudo descargar el video*\n\n` + `> *- ✎ Intenta nuevamente más tarde*`;
        return conn.reply(m.chat, txt, m, rcanal);
      }
    }

  } catch (error) {
    console.error(error);
    let txt = `乂  Y O U T U B E  -  E R R O R\n\n` + `    ✗   *Ocurrió un error*\n\n` + `> *- ✎ Intenta nuevamente más tarde*`;
    return conn.reply(m.chat, txt, m, rcanal);
  } finally {
    delete userRequests[m.sender];
  }
}

handler.help = ['play1', 'play2', 'play3', 'play4', 'playdoc'];
handler.tags = ['downloader'];
handler.command = ['play1', 'play2', 'play3', 'play4', 'audio', 'video', 'playdoc', 'playdoc2', 'musica'];
handler.register = true;
export default handler;

async function search(query, options = {}) {
  const search = await yts.search({query, hl: 'es', gl: 'ES', ...options});
  return search.videos;
}

function secondString(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const dDisplay = d > 0 ? d + (d == 1 ? ' día, ' : ' días, ') : '';
  const hDisplay = h > 0 ? h + (h == 1 ? ' hora, ' : ' horas, ') : '';
  const mDisplay = m > 0 ? m + (m == 1 ? ' minuto, ' : ' minutos, ') : '';
  const sDisplay = s > 0 ? s + (s == 1 ? ' segundo' : ' segundos') : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

async function getFileSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return parseInt(response.headers.get('content-length') || 0);
  } catch {
    return 0;
  }
}

/*import fetch from 'node-fetch';

let handler = async (m, { conn, args, command, usedPrefix}) => {
  const text = args.join(" ");
  if (!text) {
    return m.reply(
      `│ ≡◦ 🎧 *Uso correcto del comando:*
│ ≡◦ ${usedPrefix + command} shakira soltera`
);
}
  await m.react('⌛');

  try {
    const res = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status ||!json.result?.downloadUrl) {
      return m.reply(
        `│ ≡◦ ❌ *No se encontró resultado para:* ${text}
╰─⬣`
);
}

    const { title, artist, duration, cover, url} = json.result.metadata;
    const audio = json.result.downloadUrl;

    await conn.sendMessage(m.chat, {
      image: { url: cover},
      caption: `╭─⬣「 *MÚSICA SPOTIFY* 」⬣
│ ≡◦ 🎵 *Título:* ${title}
│ ≡◦ 👤 *Artista:* ${artist}
│ ≡◦ ⏱️ *Duración:* ${duration}
│ ≡◦ 🌐 *Spotify:* ${url}
╰─⬣`
}, { quoted: m});

    await conn.sendMessage(m.chat, {
      audio: { url: audio},
      mimetype: 'audio/mp4',
      ptt: false,
      fileName: `${title}.mp3`
}, { quoted: m});

    await m.react('✅');

} catch (e) {
    console.error(e);
    return m.reply(
      `│ ≡◦ ⚠️ *Error al procesar la solicitud.*
│ ≡◦ Intenta nuevamente más tarde.
╰─⬣`
);
}
};

handler.help = ['play <nombre>'];
handler.tags = ['descargas'];
handler.command = /^play$/i;
handler.register = true;

export default handler;*/