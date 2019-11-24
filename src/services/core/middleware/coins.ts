import User from '../../../models/User'
import { IUser } from '../../../interfaces/User'
import { MessageContext } from 'vk-io'

export default async (
  update: MessageContext,
  next: Function
): Promise<void> => {
  const { senderId } = update

  if (update.isInbox && senderId > 0) {
    const user: IUser = new User(senderId)

    user.add(1)
  }

  await next()
}
