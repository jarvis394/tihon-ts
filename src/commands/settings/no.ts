import db from '@globals/database'
import { DIALOG } from '@config/defaultData'

exports.run = async ({ update, args }) => {
  let state = (db
    .prepare('SELECT canReadMessages FROM main.dialogs WHERE id =' + update.peerId)
    .get())

  if (!state) {
    const data = { id: update.peerId, ...DIALOG }
    db.prepare(`INSERT OR REPLACE INTO main.dialogs (id, canReadMessages, autoMailing) VALUES (@id, @canReadMessages, @autoMailing);`).run(data)
    state = data
  }
  
  if (!state.canReadMessages) {
    state = 1
    await update.reply('✨ Теперь отсюда бот будет брать сообщения')
  } else {
    state = 0
    await update.reply('✨ Теперь отсюда бот не будет брать сообщения')
  }

  db.prepare(`UPDATE main.dialogs SET canReadMessages = ${state} WHERE id = ${update.peerId}`).run()
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
