import User from '@models/User'
import {
  getGroupByName,
  getGroupByProfileName,
  getGroupByTitle,
  getItemById,
} from '@utils/shop'
import format from '@utils/format'
import { api } from '@globals/vk'

exports.run = async ({ update, args }) => {
  const user = new User(update.senderId)
  const name = await user.getName()

  if (!args[0]) {
    return update.reply('😕 Ты не ввел группу, в которой находится предмет')
  }

  let groupName = args[0].toLowerCase()
  let group =
    getGroupByProfileName(groupName) ||
    getGroupByName(groupName) ||
    getGroupByTitle(groupName)

  if (!group) {
    return update.reply('😕 Ты ввел несуществующую группу')
  }

  let items = user.items
  let dbItem = items[group.title]

  if (!dbItem.id) {
    return update.reply('🔻 У тебя нет предмета в этой группе')
  }

  let item = getItemById(dbItem.id)

  if (!item) {
    return update.reply('🔻 У тебя есть несуществующий предмет')
  }

  user.add(item.price / 2)
  user.subtractReputation(item.rep)
  user.removeItem(group.title)

  return update.reply(
    `🎉 ${name.first_name} продал предмет ${item.name} за ${format(
      item.price / 2
    )} ₮`
  )
}

exports.command = {
  arguments: false,
  description: {
    en: 'Sells something from inventory',
    ru: 'Продаёт что нибудь из инвентаря',
  },
  alias: ['продать'],
}
