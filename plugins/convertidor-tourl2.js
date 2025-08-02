import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

const CUSTOM_FILENAME = '';
const EXPIRE_VALUE = 365;
const EXPIRE_UNIT = 'days';

let handler = async (m, { conn, args }) => {
  const q = m.quoted && m.quoted.download ? m.quoted : m;

  if (!q || !q.download) return m.reply('🌷 Responde o envía directamente una imagen, video o archivo para subirlo.');

  try {
    const media = await q.download();
    const ext = q.mimetype?.split('/')[1] || 'bin';
    const filename = `${Date.now()}.${ext}`;
    const filepath = `./${filename}`;

    fs.writeFileSync(filepath, media);
    let { file_url } = await upload(filepath);
    fs.unlinkSync(filepath);

    await m.reply(`🌱 Archivo subido:\n${file_url}`);
  } catch (e) {
    console.error(e);
    m.reply('🌷 Error al subir el archivo: ' + (e?.message || e));
  }
};

handler.help = ["tourl2"];
handler.command = ["tourl2"];
export default handler;

async function upload(filePath) {
  if (!fs.existsSync(filePath)) throw "Archivo no encontrado.";

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  if (CUSTOM_FILENAME) form.append('filename', CUSTOM_FILENAME);
  form.append('expire_value', EXPIRE_VALUE);
  form.append('expire_unit', EXPIRE_UNIT);

  const contentLength = await new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (err) reject(err);
      else resolve(length);
    });
  });

  try {
    const response = await axios.post('https://sylphy.xyz/upload', form, {
      headers: {
        ...form.getHeaders(),
        'Content-Length': contentLength
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    return response.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    else throw err.message;
  }
}