import { PREFIX, MENTION_PREFIX } from '../../../config/constants'
import commands from '../../../globals/commands'
import isAdmin from '../../../utils/isAdmin'
import { MessageContext } from 'vk-io'

export default async (
  update: MessageContext,
  next: Function
): Promise<void | number> => {
  const { text, senderId, state } = update
  let msg: string = text // Temporary message text

  // Check if command's prefix is mention or usual prefix
  // If none found then return
  if (text.startsWith(MENTION_PREFIX)) {
    state.isMentioned = true
  } else if (text.startsWith(PREFIX)) {
    state.isPrefixed = true
  } else return

  // Load message payload if found
  if (update.hasForwards || update.hasAttachments()) {
    await update.loadMessagePayload()
  }

  // Remove mention from message text if it is mentioned
  // Otherwise, remove the prefix
  if (state.isMentioned) {
    msg = text
      .split(' ')
      .slice(1)
      .join(' ')
  } else if (state.isPrefixed) {
    msg = text.slice(PREFIX.length)
  } else {
    state.isCommand = false
  }

  // Check if user is admin
  state.isAdmin = isAdmin(senderId)

  // If message is possibly command
  if (state.isMentioned || state.isPrefixed) {
    // Command is the first word in message
    state.commandText = msg.split(' ').shift()

    // Arguments are everything after command
    state.arguments = msg.split(' ').slice(1)

    // Trim arguments
    state.arguments = state.arguments
      .map(a => a.trim())
      .filter(a => a.length !== 0)

    if (state.commandText.startsWith('?dev-')) {
      if (state.isAdmin) {
        state.command = {
          name: state.commandText.slice(5),
          group: 'dev',
        }
      } else {
        return await update.reply('🔐 Такое доступно только админам')
      }
    } else {
      commands.forEach(c => {
        const commandFound = s => c.name === s
        const aliasFound = s => c.alias && c.alias.some(e => s === e)

        if (commandFound(state.commandText) || aliasFound(state.commandText)) {
          return (state.command = c)
        }
      })
    }

    // Update the state
    state.isCommand = !!state.command
  }

  // If there is only mention then set the state and return
  if (state.isMentioned && !state.isCommand) {
    state.isMentionMessage = true
  }

  await next()
}
