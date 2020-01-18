import { USERS, DIALOGS } from '@config/blacklist'
import { MessageContext } from 'vk-io'

export default async (
  update: MessageContext,
  next: Function
): Promise<number | void> => {
  const { senderId, peerId, state } = update

  if (state.isCommand) {
    // Check if user is in blacklist
    if (USERS.some(id => id === senderId)) {
      return await update.reply('🤗 Подмойся, омежка')
    }

    // Check if dialog is in blacklist
    else if (DIALOGS.some(id => id === peerId)) {
      return await update.reply('🤗 Вы тут заблокированы)')
    }
  }

  await next()
}
