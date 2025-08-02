import fetch from 'node-fetch';

let handler = async (m, { text, command, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, `🚩 Ingresa el término de búsqueda en GitHub usando Dark-Core API.\n\n*Ejemplo:*\n> ${usedPrefix + command} GataBot-MD`, m);

  await m.react('⏳');

  try {
    const url = `https://dark-core-api.vercel.app/api/search/github?key=api&text=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json || !json.data || json.data.length === 0) {
      await m.react('❌');
      return m.reply('❌ No se encontraron repositorios con ese nombre.', m);
    }

    let txt = '```乂  R E S U L T A D O S   G I T H U B - S E A R C H```\n\n';

    json.data.slice(0, 10).forEach((repo, i) => {
      txt += `📦 *${i + 1}.* ${repo.name}\n`;
      txt += `🔗 URL: ${repo.url}\n`;
      txt += `📝 Descripción: ${repo.description || 'Sin descripción'}\n\n`;
    });

    await m.reply(txt.trim());
    await m.react('✅');

  } catch (error) {
    console.error(error);
    await m.react('⚠️');
    await m.reply('⚠️ Ocurrió un error al contactar con la API de Dark-Core.', m);
  }
};

handler.tags = ['internet'];
handler.help = ['githubsearch <texto>'];
handler.command = ['githubsearch', 'gokublacksearch'];
handler.register = true;

export default handler;
