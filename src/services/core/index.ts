import vk from '../../globals/vk'
import log from '../../globals/log'

vk.updates.startPolling()
log.info('[VK] Started polling')

require('./middleware')
