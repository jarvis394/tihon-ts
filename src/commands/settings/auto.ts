import db from '@globals/database'
import { DIALOG } from '@config/defaultData'

exports.run = async ({ update, args }) => {
  let state = (db
    .prepare('SELECT autoMailing FROM main.dialogs WHERE id =' + update.peerId)
    .get())

  if (!state) {
    const data = { id: update.peerId, ...DIALOG }
    db.prepare(`INSERT OR REPLACE INTO main.dialogs (id, canReadMessages, autoMailing) VALUES (@id, @canReadMessages, @autoMailing);`).run(data)
    state = data
  }

  if (state.autoMailing) {
    state = 0
    await update.reply('✨ Теперь здесь не будет отправляться рассылка')
  } else {
    state = 1
    await update.reply('✨ Теперь тут будет отправляться рассылка')
  }

  db.prepare(`UPDATE main.dialogs SET autoMailing = ${state} WHERE id = ${update.peerId}`).run()
}

exports.command = {
  name: 'auto',
  arguments: false,
  description: {
    en: 'Disable/Enable auto-sending messages',
    ru: 'Отключить/Включить автоматическую рассылку сообщений',
  },
  alias: ['авто', 'рассылка'],
  group: 'settings',
}
