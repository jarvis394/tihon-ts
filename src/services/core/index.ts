import { vk } from '../../globals/vk'
import log from '../../globals/log'

vk.updates.startPolling()
log.info('Started polling', { service: 'vk' })

require('./middleware')
