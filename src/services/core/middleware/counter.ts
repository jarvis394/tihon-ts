import handleError from '../../../utils/handleError'
import { sessionStorage } from '../../../globals/storages'
import ICommand from '../../../interfaces/Command'
import { MessageContext } from 'vk-io'

export default async (
  update: MessageContext,
  next: Function
): Promise<void> => {
  let count: number = 0

  if (update.isInbox) {
    if (sessionStorage.has(update.peerId)) {
      count = sessionStorage.get(update.peerId).counter || 0
    }

    count += 1

    if (count % 25 === 0) {
      try {
        const cmd: ICommand = require('../../../commands/random/random')
        await cmd.run({ update })
      } catch (e) {
        handleError(update, e)
      }

      count = 0
    }

    if (!update.state) update.state = {}

    update.state.session = { counter: count }
    sessionStorage.set(update.peerId, update.state.session)
  }

  await next()
}
