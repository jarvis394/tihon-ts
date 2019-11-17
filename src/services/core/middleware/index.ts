import vk from '@globals/vk'
import mention from './mention'
import runCommand from './command'
import log from './log'
import counter from './counter'
import coins from './coins'
import filter from './filter'
import payload from './payload'
import session from './session'
import blacklist from './blacklist'
import timeout from './timeout'
import { MessageContext } from 'vk-io'
;[
  counter, // Count messages
  coins, // Add coins
  filter, // Filter messages
  payload, // Set message payload
  session, // Set dialog session
  blacklist, // Filter blacklisted users and multidialogs
  timeout, // Filter commands by timeout
].forEach(middleware => vk.updates.use(middleware))

vk.updates.on(
  'message',
  async (update: MessageContext): Promise<number | void> => {
    // If message is only mention
    // then return mention message
    if (update.state.isMentionMessage) {
      return mention(update)
    }

    // Else if message is command then
    // log it and run the command
    else if (update.state.isCommand) {
      log(update)
      return runCommand(update)
    }
  }
)
