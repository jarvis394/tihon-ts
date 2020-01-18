import { MessageContext } from 'vk-io'
import handleError from '@utils/handleError'
import ICommand from '@interfaces/Command'

export default async (update: MessageContext): Promise<number> => {
  try {
    const cmd: ICommand = require('@commands/random/random')
    return await cmd.run({ update })
  } catch (e) {
    handleError(update, e)
  }
}
