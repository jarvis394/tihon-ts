import User from '@models/User'
import { CURRENCY } from '@config/constants'
import ICommand from '@interfaces/Command'
import { command as list } from './list'
import { command as who } from './who'

exports.run = async ({ update, args }) => {
  const user = new User(update.senderId)
  const { state, amount } = user.isEnoughFor(1000)
  if (!state)
    return update.reply(
      `🧮 Не хватает денег: у тебя ${amount} ${CURRENCY}, а нужно 1000 ${CURRENCY}`
    )

  let commandName: string = args[0]
  
  // Return if no arguments
  if (!commandName) {
    return update.reply('Введи команду')
  } 
  // Find 'list' command in aliases
  else if (commandName === 'list' || list.alias.some(e => e === commandName)) {
    commandName = 'list'
  } 
  // Find 'who' command in aliases
  else if (commandName === 'who' || who.alias.some(e => e === commandName)) {
    commandName = 'who'
  } 
  // Return error if no command was found
  else {
    return update.reply('✖️ Нет такой команды!')
  }

  // Subtract money for using mention mode 
  user.subtract(1000)

  // Run commmand
  require('./' + commandName).run({
    update,
    args,
    mentionCmdState: true,
  })
}

exports.command = {
  arguments: '(arg)|(предл.)',
  description: {
    en: 'Who is ***?',
    ru: 'Кто ***?',
  },
  alias: ['упомянуть', 'упомяни'],
  group: 'utils',
}
