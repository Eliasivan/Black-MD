/*
• @Eliasivan 
- https://github.com/Eliasivan 
*/
import fs from 'fs';
import path from 'path';
import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";

let handler = async (m, { conn, isRowner }) => {
  if (!m.quoted || !/image/.test(m.quoted.mimetype)) return m.reply('🍬 Por favor, responde a una imagen con el comando *setprofile* para actualizar la foto de perfil de WhatsApp.');
  try {
    const media = await m.quoted.download();
    if (!isImageValid(media)) {
      return m.reply('🍭 El archivo enviado no es una imagen válida.');
    }
    await conn.updateProfilePicture(conn.user.jid, { url: media });
    await conn.sendFile(m.chat, media, 'profile.jpg', '🍬 Foto de perfil actualizada.', m);
  } catch (error) {
    console.error(error);
    m.reply('✘ Hubo un error al intentar cambiar la foto de perfil.');
  }
};

const isImageValid = (buffer) => {
  const magicBytes = buffer.slice(0, 4).toString('hex');
  if (magicBytes === 'ffd8ffe0' || magicBytes === 'ffd8ffe1' || magicBytes === 'ffd8ffe2') {
    return true;
  }
  if (magicBytes === '89504e47') {
    return true;
  }
  if (magicBytes === '47494638') {
    return true;
  }
  return false;
};

handler.help = ['setprofile'];
handler.tags = ['tools'];
handler.command = ['setprofile'];
handler.rowner = true;
export default handler;