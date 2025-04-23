handler.before = async function(m) {
  const id = m.chat;

  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/^🚩/i.test(m.quoted.text)) return !0;

  this.tekateki = this.tekateki ? this.tekateki : {};

  if (!(id in this.tekateki)) return m.reply('✨️ Ese acertijo ya ha terminado!');

  if (m.quoted.id == this.tekateki[id][0].key.id) {
    const json = JSON.parse(JSON.stringify(this.tekateki[id][1]));
    const userResponse = m.text.trim().toLowerCase();
    const correctResponse = json.response.trim().toLowerCase();

    console.log(`Respuesta del usuario: ${userResponse}`);
    console.log(`Respuesta correcta: ${correctResponse}`);

    if (userResponse == correctResponse) {
      global.db.data.users[m.sender].estrellas += this.tekateki[id][2];
      m.reply(`🎉 *Respuesta correcta!*\n+${this.tekateki[id][2]} Centavos`);
      clearTimeout(this.tekateki[id][3]);
      delete this.tekateki[id];
    } else if (similarity(userResponse, correctResponse) >= threshold) {
      m.reply(`🤔 Casi lo logras!`);
    } else {
      m.reply('❌ Respuesta incorrecta!');
    }
  }
  return !0;
};