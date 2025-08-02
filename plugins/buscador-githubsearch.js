import fetch from 'node-fetch';

let handler = async (m, { text, command }) => {
    if (!text) throw '🔍 Ingresa un texto para buscar repositorios en GitHub.\n\nEjemplo: .githubsearch whatsapp bot';

    let url = `https://dark-core-api.vercel.app/api/search/github?key=api&text=${encodeURIComponent(text)}`;

    try {
        let res = await fetch(url);
        if (!res.ok) throw '🌐 Error al contactar con la API';

        let json = await res.json();

        if (!json.data || json.data.length === 0) {
            throw '❌ No se encontraron resultados.';
        }

        let resultados = json.data.map((repo, index) => {
            return `*${index + 1}.* ${repo.name}\n🔗 ${repo.url}\n📄 ${repo.description || 'Sin descripción'}\n`;
        }).join('\n');

        m.reply(`🔎 *Resultados para:* ${text}\n\n${resultados}`);
    } catch (e) {
        console.error(e);
        throw '❌ Error al buscar en GitHub.';
    }
};

handler.command = ['githubsearch'];
handler.help = ['githubsearch <texto>'];
handler.tags = ['internet'];

export default handler;
