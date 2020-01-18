import { MessageContext } from 'vk-io'
import { timeouts } from '@globals/storages'
import moment from 'moment'

moment.locale('ru')

interface ITimeoutRecord {
  timeout: number
  timestamp: number
  command: string
}

export default async (
  update: MessageContext,
  next: Function
): Promise<void | number> => {
  if (update.state.isMentionMessage) return await next()
  else if (!update.state.isCommand) return 

  const { senderId, state } = update
  const { command } = state
  const found: ITimeoutRecord[] = timeouts.get(senderId)
  const now: number = Date.now()

  if (found && found.some(r => r.command === command.name)) {
    const { timestamp, timeout } = found.find(r => r.command === command.name)

    if (now < timestamp + timeout) {
      const left: Date = new Date(timestamp + timeout)
      return update.reply(
        `😑 Эту команду можно использовать ${moment(left).fromNow()}`
      )
    } else {
      // Delete record from storage
      timeouts.set(senderId, found.filter(r => r.command !== command.name))
    }
  }

  await next()
}
