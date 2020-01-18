import groups from '@globals/groups'
import commands from '@globals/commands'
const heading = '🔍 Смотри описания команд на сайте: https://tihon.glitch.me\n\n'

exports.run = async ({ update, args }) => {
  if (args[0]) {
    const cmd = commands.find(e => e.name === args[0] || (e.alias && e.alias.some(a => a === args[0])))
    
    if (!cmd) return update.reply(heading + '🔻 Команда не найдена')
    
    return update.reply(heading + `/${cmd.name} (${cmd.alias.join(', ')})\n\n📍 ${cmd.description.ru}`)
  }
  
  const response = groups.map(group => {
    return `${group.icon} ${group.name}\n  ${commands.filter(c => c.group === group.path).map(c => `${c.name}`).join(', ')}\n\n`
  }).join('')
  return update.reply(heading + response)
}

exports.command = {
  name: 'help',
  arguments: '(command)|(command)',
  description: {
    en: 'Helps you find a description of the command you need',
    ru: 'Помогает найти нужную тебе команду',
  },
  alias: ['помощь', 'справка', 'начать'],
  group: 'global',
}
