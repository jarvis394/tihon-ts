import User from '@models/User'
import format from '@utils/format'
import { randomArray } from '@utils/random'
const DAY = 86400000
import { CURRENCY } from '@config/constants'
import moment from 'moment'

exports.run = async ({ update, args }) => {
  moment.locale('ru')

  let firstTimeFlag = false
  let user = new User(update.senderId)
  let lastTime = user.earnings.daily

  // If no data found
  if (!lastTime) {
    firstTimeFlag = true
  }

  // Last time command used
  let now = Date.now()

  if (now - lastTime >= DAY || firstTimeFlag) {
    let bonus = ''

    if (Math.random() > 5) {
      let amt = randomArray([1000, 2500, 2500, 5000])
      user.add(amt)
      bonus = amt + ' ' + CURRENCY
    } else {
      let amt = randomArray([50, 100, 100, 100, 500])
      user.addReputation(amt)
      bonus = '💠 ' + amt + ' R'
    }

    user.setEarning('daily', now)

    return update.send(`😝 Вы получили ежедневный бонус:\n ${bonus}`)
  } else {
    const left = new Date(lastTime + DAY)

    return update.reply(
      '😕 Ты уже использовал бонус!\n' +
        `Команда будет доступна ${moment(left).fromNow()}`
    )
  }
}

exports.command = {
  arguments: false,
  description: {
    en: 'Get your daily bouns!',
    ru: 'Получи свой ежедневный бонус!',
  },
  alias: ['бонус', 'bonus'],
}
