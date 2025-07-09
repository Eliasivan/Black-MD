export async function before(message) {
  if (!message.text || !global.prefix.test(message.text)) return;

  const prefixUsed = global.prefix.exec(message.text)[0];
  const commandName = message.text.slice(prefixUsed.length).trim().split(" ")[0].toLowerCase();

  const commandExists = (cmd, plugins) => {
    for (let plugin of Object.values(plugins)) {
      if (plugin.command) {
        const commands = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
        if (commands.includes(cmd)) return true;
      }
    }
    return false;
  };

  if (commandExists(commandName, global.plugins)) {
    let chatData = global.db.data.chats[message.chat];
    let userData = global.db.data.users[message.sender];
    if (chatData.isBanned) return;
    if (!userData.commands) userData.commands = 0;
    userData.commands += 1;
  } else {
    let som = 0;
    await message.reply(
      `⏤͟͟͞͞El comando *${prefixUsed}${commandName}* no existe.\nPara ver la lista de comandos usa:\n» *${prefixUsed}Menu*\n❕ *Similitud:* _${parseInt(som)}%_`
    );
  }
}