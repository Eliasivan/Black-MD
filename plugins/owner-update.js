import { execSync } from 'child_process'

var handler = async (m, { conn, text }) => {
  await m.react('❤️')
  await conn.reply(m.chat, 'Aguarde unos segundos...', m)

  try {
    const stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''))
    let messager = stdout.toString()

    if (/ya (estoy|está)[\s\w]*actualizad[ao]/i.test(messager)) {
      await conn.reply(m.chat, 'Ya estoy re actualizado 💫', m)
    } else if (/actualizad[ao]|changed|files? updated?/i.test(messager)) {
      await conn.reply(m.chat, '¡Actualización completada! ✅', m)
    } else {
      await conn.reply(m.chat, messager, m)
    }
  } catch {
    try {
      const status = execSync('git status --porcelain')
      if (status.length > 0) {
        const conflictedFiles = status.toString().split('\n').filter(line => line.trim() !== '').map(line => {
          if (line.includes('.npm/') || line.includes('.cache/') || line.includes('tmp/') || line.includes('BlackSession/') || line.includes('npm-debug.log')) {
            return null
          }
          return '*→ ' + line.slice(3) + '*'
        }).filter(Boolean)
        if (conflictedFiles.length > 0) {
          const errorMessage = `💭 Se han hecho cambios locales qué entran en conflicto con las Actualizaciones del Repositorio, Para actualizar, reinstala el Bot o realiza las actualizaciones manualmente.\nArchivos en conflicto:\n${conflictedFiles.join('\n')}`
          await conn.reply(m.chat, errorMessage, m)
        }
      }
    } catch (error) {
      console.error(error)
      let errorMessage2 = '⚠️ Ocurrió un error inesperado.'
      if (error.message) {
        errorMessage2 += '\n⚠️ Mensaje de error: ' + error.message
      }
      await conn.reply(m.chat, errorMessage2, m)
    }
  }
}

handler.help = ['update', 'actualizar']
handler.tags = ['owner']
handler.command = ['update', 'actualizar']
handler.rowner = true

export default handler