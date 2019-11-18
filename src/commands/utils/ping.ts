export const run = async ({ update }) => {
  const replies = [
    'Шо ты меня пингуешь братец',
    'А?',
    'Я С СЕЛА',
    'Чавой?',
    'Пинг-понг',
  ]
  const { randomArray } = require('../../utils/random')

  return update.reply(randomArray(replies))
}

export const command = {
  name: 'ping',
  arguments: false,
  description: {
    en: 'Pong!',
    ru: 'Понг!',
  },
  alias: ['пинг', 'эй', 'привет'],
  group: 'utils',
}
