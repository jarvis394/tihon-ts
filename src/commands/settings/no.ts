import db from '@globals/database'

exports.run = async ({ update, args }) => {
  let state = (db
    .prepare('SELECT canReadMessages FROM main.dialogs WHERE id =' + update.peerId)
    .get() || { canReadMessages: true }).canReadMessages

  if (state) {
    state = false
    update.send('✨ Теперь отсюда бот будет брать сообщения')
  } else {
    state = true
    update.send('✨ Теперь отсюда бот не будет брать сообщения')
  }

  db.prepare(`UPDATE INTO main.dialogs SET canReadMessages = ${state}`).run()
}

exports.command = {
  name: 'no',
  arguments: false,
  description: {
    en: 'Will your chat be in random?',
    ru: 'Будет или нет диалог попадать в random?',
  },
  group: 'settings',
  alias: ['нет'],
}
