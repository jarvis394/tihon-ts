const { AUTO_INTERVAL } = require('@config/constants')
const { api } = require('@globals/vk')
const { log } = require('@globals/log')

setInterval(async () => {
  let list = await api.friends.getRequests({
    count: 1000,
  })
  list.items.forEach(friend => {
    api.friends
      .add({
        user_id: friend,
      })
      .catch(e => log.error(e))

    log.info('Added ' + friend + ' as friend', { private: true })
  })
}, AUTO_INTERVAL)
