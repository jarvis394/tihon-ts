import commands from '@globals/commands'

exports.run = async ({ update, args }) => {
  const cmdName = args[0]
  let command

  if (!cmdName) {
    return update.reply('🔻 Введи команду')
  }

  commands.forEach(c => {
    const commandFound = s => c.name === s
    const aliasFound = s => c.alias && c.alias.some(e => s.startsWith(e))

    if (commandFound(cmdName) || aliasFound(cmdName)) {
      return (command = c)
    }
  })

  if (!command) {
    return update.reply('🔻 Команда не найдена')
  }

  const { group, name } = command

  delete require.cache[require.resolve(`../../commands/${group}/${name}`)]

  return update.reply('👌')
}

exports.command = {
  hidden: true,
}
