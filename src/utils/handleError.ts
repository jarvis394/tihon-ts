import { MessageContext } from 'vk-io'
import log from '@globals/log'

/**
 * Handles error
 * @param {object} update Update object
 * @param {object} e Error object
 */
export default (update: MessageContext, e: Error) => {
  log.error({
    message: `Command /${update.state.commandName} failed: ${e.message}`,
    stack: e.stack
  })

  return update.reply('🔻 ' + e.message)
}
