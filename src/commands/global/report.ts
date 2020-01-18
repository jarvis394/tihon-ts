import log from '@globals/log'

exports.run = async ({ update, args }) => {
  const ID = 555444315
  const messages = update.payload.message.fwd_messages

  if (!messages[0]) {
    return await update.reply(
      '😯 Перешли мне сообщения (через значок →), которые считаешь багнутыми, чтобы отправить их разработчикам.'
    )
  }

  try {
    await update.send(
      `🛠️ Репорт от *id${update.senderId}, чат ${update.chatId}:`,
      {
        peer_id: ID,
        forward_messages: messages.map(e => e.id).join(),
      }
    )
  } catch (e) {
    log.error(e)
    return await update.reply(
      '🔻 Не удалось отправить сообщение:\n' + e.message
    )
  }

  return await update.reply('😘 Спасибо за поддержку!')
}

exports.command = {
  name: 'report',
  arguments: '(fwd)|(сообщение)',
  description: {
    en: 'Report forwarded message',
    ru: 'Зарепортить пересланное сообщение',
  },
  alias: ['репорт'],
  group: 'global',
}
