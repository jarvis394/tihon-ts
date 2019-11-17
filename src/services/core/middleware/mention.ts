import { MessageContext } from 'vk-io'
import randomMessage from '@utils/randomMessage'

export default async (update: MessageContext): Promise<number> => {
  const { text } = await randomMessage()

  return await update.send(text)
}
