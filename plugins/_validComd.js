function levenshtein(a, b) {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

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
    let allCommands = [];
    for (let plugin of Object.values(global.plugins)) {
      if (plugin.command) {
        if (Array.isArray(plugin.command)) {
          allCommands.push(...plugin.command.map(cmd => String(cmd)));
        } else {
          allCommands.push(String(plugin.command));
        }
      }
    }
    let minDist = Infinity, bestMatch = "", bestSimilarity = 0;
    for (let cmd of allCommands) {
      let dist = levenshtein(commandName, cmd.toLowerCase());
      let similarity = Math.max(0, 100 - Math.round((dist / Math.max(commandName.length, cmd.length)) * 100));
      if (dist < minDist || (dist === minDist && similarity > bestSimilarity)) {
        minDist = dist;
        bestMatch = cmd;
        bestSimilarity = similarity;
      }
    }

    await message.reply(
      `⏤͟͟͞͞El comando *${prefixUsed}${commandName}* no existe.\nQuizás quisiste decir: *${prefixUsed}${bestMatch}*\nPara ver la lista de comandos usa:\n» *${prefixUsed}Menu*\n❕ *Similitud:* _${bestSimilarity}%_`
    );
  }
}