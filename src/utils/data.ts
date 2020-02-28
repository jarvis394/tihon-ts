import log from '@globals/log'
import { MessagesGetConversationsResponse } from 'vk-io'
import path from 'path'

const rel: string = __filename.split(path.sep).some(e => e === 'dist') ? '../../../' : '../../'

/**
 * Returns dialogs list
 */
export const getDialogs = (): MessagesGetConversationsResponse[] => {
  try {
    const data = require(rel + 'temp/dialogs.json')
    return data.items
  } catch (e) {
    log.error('On trying to get dialogs list: ' + e)
  }
}

/**
 * Returns histories list
 */
export const getHistories = () => {
  try {
    const data = require(rel + 'temp/messages.json')
    return data.response
  } catch (e) {
    log.error('On trying to get histories list: ' + e)
  }
}
