import { api } from '../../globals/vk'

export const run = async ({ update, args }) => {
  const members = await api.messages.getConversationMembers({
    peer_id: update.peerId,
  })

  // If user is not in VK dialog admins list then return an error
  if (!members.items.find(e => e.member_id === update.senderId).is_admin) {
    throw new Error('🤗 Такое доступно только админам!')
  }

  const text =
    members.profiles.map(e => `[id${e.id}|.]`).join(' ') +
    '\n\n' +
    args.join(' ')

  return text
}

export const command = {
  arguments: '(text)|(текст)',
  description: {
    en: 'Says your message to everyone with mention',
    ru: 'Обращается ко всем участникам беседы с твоим сообщением',
  },
  alias: ['все', 'всем', '@everyone'],
  group: 'utils',
}
