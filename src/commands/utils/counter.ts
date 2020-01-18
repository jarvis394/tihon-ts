export const run = async ({ update }) => {
  return update.reply(`⏰ Осталось сообщений до отправки рандома: ${25 - update.state.session.counter}`)
}

export const command = {
  name: 'counter',
  arguments: false,
  description: {
    en:
      'Show current amount of messages (on every 25th message bot send random thing)',
    ru:
      'Показывает количество сообщений до отправки всякой рандомной фигни (каждое 25 сообщение)',
  },
  group: 'utils',
}
