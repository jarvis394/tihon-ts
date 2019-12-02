import handleError from '@utils/handleError'
import ICommand from '@interfaces/Command'
import { MessageContext } from 'vk-io'
import log from '@globals/log'

export default async (update: MessageContext): Promise<number | void> => {
  // Destructure state
  const { command: cmd, arguments: args } = update.state

  // Try running command file
  try {
    // Require command
    const command: ICommand = require(`@commands/${cmd.group}/${cmd.name}`)

    // Run asynchronously
    return await command.run({ update, args })
  } catch (e) {
    // Throw away if command was not found
    // Actually, the 'filter' middleware filters any non-command
    // message, so there is probably 0% chance of getting this error.
    // Who knows...
    if (e.code === 'MODULE_NOT_FOUND') log.error(e)
    // In other case, handle this error
    else return handleError(update, e)
  }
}
