import User from '@models/User'
import format from '@utils/format'
import { USERS } from '@config/blacklist'
import { CURRENCY } from '@config/constants'

exports.run = async ({ update, args }) => {
  let id
  try {
    id = parseInt(args[0].split('|')[0].slice(3))
    if (isNaN(id)) throw new Error('argument is NaN')
  } catch (e) {
    id = update.senderId
  }

  if (id < 0) {
    return update.reply('🔻 Нельзя посмотреть баланс группы')
  }

  if (USERS.some(e => e === id.toString()))
    return update.reply('😠 Этот пользователь заблокирован')

  const user = new User(id)

  return update.reply(
    (id === update.senderId
      ? 'Твой баланс:⠀⠀\n'
      : 'Баланс ' + (await user.getFullName('acc')) + ': \n') +
    '🏦 ' +
    format(user.money) +
    ' ' +
    CURRENCY
  )
}

exports.command = {
  name: 'balance',
  arguments: false,
  description: {
    en: 'Shows balance of user',
    ru: 'Показывает баланс пользователя',
  },
  alias: ['баланс'],
  group: 'shop',
}
