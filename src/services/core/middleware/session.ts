import { MessageContext } from 'vk-io'
import { COMMAND_COOLDOWN } from '@config/constants'
import { talkedRecently } from '@globals/storages'

export default async (update: MessageContext, next: Function) => {
  const { senderId, state } = update

  if (state.isCommand) {
    // Return if user has used command recently
    if (talkedRecently.has(senderId)) return

    // Add user to a Set
    talkedRecently.add(senderId)
    setTimeout(() => talkedRecently.delete(senderId), COMMAND_COOLDOWN)
  }

  await next()
}
