import events from '@structures/Events'
import dialogs from './dialogs'
import messages from './messages'
import { DATA_GET_INTERVAL } from '@config/constants'
import log from '@globals/log'

events.on('getDialogsSuccess', () => messages())
events.on('getMessagesSuccess', () => events.emit('load'))

setInterval(() => run(), DATA_GET_INTERVAL)

// Get dialogs
run()

function run() {
  log.debug('Started getting messages and dialogs data')
  dialogs()
}
