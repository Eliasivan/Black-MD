import fetch from 'node-fetch';

let handler = async (m, { text, command, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, `🚩 Usa: ${usedPrefix + command} <término>`, m);
  await m.react('⏳');

  try {
    console.log('Buscando:', text);
    const url = `https://dark-core-api.vercel.app/api/search/github?key=api&text=${encodeURIComponent(text)}`;
    console.log('URL:', url);

    const res = await fetch(url);
    console.log('Status:', res.status);
    const json = await res.json();
    console.log('JSON rec:', json);

    const arr = json.data || json.items;
    if (!arr || !Array.isArray(arr) || arr.length === 0) {
      await m.react('❌');
      return m.reply('❌ No se encontraron resultados.', m);
    }

    let txt = '```Resultados GitHub – Dark‑Core``` \n\n';
    arr.slice(0,10).forEach((repo, i) => {
      txt += `📌 *${i+1}* ${repo.name}\n🔗 ${repo.url || repo.html_url}\n📝 ${repo.description || 'Sin descripción'}\n\n`;
    });

    await m.reply(txt.trim());
    await m.react('✅');
  } catch (err) {
    console.error('Catch final:', err);
    await m.react('⚠️');
    await m.reply(`⚠️ Error: ${err}`, m);
  }
};

handler.tags = ['internet'];
handler.help = ['githubsearch <texto>', 'dark-core <texto>'];
handler.command = ['githubsearch', 'dark-core'];
handler.register = true;

export default handler;
