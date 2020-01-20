import { VK } from 'vk-io'
import format from '@utils/format'
import getUsersTop from '@utils/getUsersTop'
import log from '@globals/log'
import { GROUP_TOKEN as TOKEN, MODE } from '@config/keys'
import { GROUP_ID as ID, GROUP_STATS_UPD_INTERVAL } from '@config/constants'

// Init VK instance
const vk = new VK()

// Set VK options
vk.setOptions({
  token: TOKEN,
  authScope: 'all'
})

const tick = async () => {
  const d = getUsersTop().slice(0, 10)  // Get a slice fromthe given top
  let body = []
  let ids = []

  for (let user of d) {
    ids.push(user.id)
  }

  const r = await vk.api.users.get({ user_ids: ids.join(',') })
  d.forEach((user, i) => {
    body.push([
      {
        text: r[i].first_name + ' ' + r[i].last_name,
        url: 'https://vk.com/id' + user.id,
        icon_id: 'id' + user.id
      },
      {
        text: '💠 ' + format(user.reputation) + ' R'
      },
      {
        text: '💵 ' + format(user.money) + ' T'
      }
    ])
  })

  const data = {
    title: 'Статистика',
    head: [
      {
        text: 'Пользователь',
        align: 'left'
      },
      {
        text: 'Рейтинг',
        align: 'right'
      },
      {
        text: 'Баланс',
        align: 'right'
      }
    ],
    body: body
  }

  await vk.api.appWidgets.update({
    code: 'return ' + JSON.stringify(data) + ';',
    type: 'table' 
  })

  log.info('Updated statistics table in group', { private: true })
}

if (MODE === 'PRODUCTION') {
  setInterval(async () => await tick(), GROUP_STATS_UPD_INTERVAL)
}