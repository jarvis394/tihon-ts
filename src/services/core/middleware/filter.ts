import { MessageContext } from 'vk-io'
import { ADMINS_ONLY, EXCLUDE_ADMINS } from '@config/admins'
import isAdmin from '@utils/isAdmin'

export default async (
  update: MessageContext,
  next: Function
): Promise<void> => {
  const { text, isOutbox, senderId } = update

  if (isOutbox) return
  if (text === '' || !text) return
  if (senderId < 0) return
  if (ADMINS_ONLY && !isAdmin(senderId)) return
  if (EXCLUDE_ADMINS && isAdmin(senderId)) return

  await next()
}
