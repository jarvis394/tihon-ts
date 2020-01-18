import User from '@models/User'
import { getItemById, getGroupById } from '@utils/shop'

exports.run = async ({ update, args }) => {
  let user = new User(
    args[0] && args[1] ? args[1].split('|')[0].slice(3) : update.senderId
  )

  if (!args[0]) return update.send('❌ no num provided')

  let id = parseInt(args[0])
  let item = getItemById(id)
  user.setItem(id)

  return update.send('added ' + args[0])
}

exports.command = {
  hidden: true,
}
