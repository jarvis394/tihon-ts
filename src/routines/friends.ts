import { AUTO_INTERVAL } from '@config/constants'
import { api } from '@globals/vk'
import log from '@globals/log'

setInterval(async () => {
  log.info('Started auto-adding friends')

  const list = await api.friends.getRequests({ count: 1000 })

  // Run through the list of pending friends and add each of them
  list.items.forEach(async id => {
    await api.friends.add({ user_id: id }).catch(e => log.error(e))
    log.info('Added ' + id + ' as a friend', { private: true })
  })
}, AUTO_INTERVAL)
