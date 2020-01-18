import { randomArray } from '@utils/random'
import { api } from '@globals/vk'
import { UsersFields, UsersUserFull } from 'vk-io'

export const run = async ({ update, args, mentionCmdState }) => {
  const users = await api.messages.getConversationMembers({
    peer_id: update.peerId,
    fields: ['first_name' as UsersFields, 'last_name' as UsersFields],
  })
  const length = users.profiles.length >= 10 ? 10 : users.profiles.length

  let list: string[] = []
  let history: number[] = []

  // If mentioned state is true then remove
  // first argument as it is a command
  if (mentionCmdState) args.shift()

  // Loop through the users (max 10)
  for (let i = 0; i < length; i++) {
    let person: UsersUserFull = randomArray(users.profiles)
    while (history.some(e => e === person.id)) { // Find unique one
      person = randomArray(users.profiles)
    }

    history.push(person.id)

    if (mentionCmdState) {
      list.push(
        `${i + 1}. [id${person.id}|${person.first_name +
          ' ' +
          person.last_name}]`
      )
    } else {
      list.push(`${i + 1}. ${person.first_name + ' ' + person.last_name}`)
    }
  }

  return update.reply(`🔹 Топ ${args.length === 0 ? 'села' : args.join(' ')}:\n${list.join(
    '\n'
  )}`)
}

export const command = {
  name: 'list',
  arguments: '(arg)|(предл.)',
  description: {
    en: 'List of ***',
    ru: 'Список ***',
  },
  alias: ['список'],
  group: 'utils',
}
