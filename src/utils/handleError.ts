import { MessageContext } from 'vk-io'

/**
 * Handles error
 * @param {object} update Update object
 * @param {object} e Error object
 */
export default (update: MessageContext, e: Error) => update.reply('🔻 ' + e.message)
