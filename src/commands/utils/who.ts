import { UsersFields } from 'vk-io'
import { api } from '../../globals/vk'
import { randomArray } from '../../utils/random'
import { Command } from '../../interfaces'
const replies = ['Я думаю, что', 'Наверное', 'Возможно']

export const run: Command['run'] = async ({ update, args, mentionCmdState }) => {
  let person = await api.messages.getConversationMembers({
    peer_id: update.peerId,
    fields: ['first_name' as UsersFields, 'last_name' as UsersFields]
  })
  
  // If mentioned state is true then remove
  // first argument as it is a command
  if (mentionCmdState) args.shift()

  person = randomArray(person.profiles)
  const name = mentionCmdState
    ? `[id${person.id}|${person.first_name + ' ' + person.last_name}]`
    : `${person.first_name + ' ' + person.last_name}`

  return update.reply(`${randomArray(replies)}${
    args.length !== 0 ? ' ' + args.join(' ') : ''
  } это ${name}`)
}

export const command = {
  name: 'who',
  arguments: '(arg)|(предл.)',
  description: {
    en: 'Who is ***?',
    ru: 'Кто ***?',
  },
  alias: ['кто', 'назови'],
  group: 'utils',
}
