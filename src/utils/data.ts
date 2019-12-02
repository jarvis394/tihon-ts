import log from '@globals/log'

/**
 * Returns dialogs list
 */
export const getDialogs = () => {
  try {
    const data = require('../../temp/dialogs.json')
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
    const data = require('../../temp/messages.json')
    return data.response
  } catch (e) {
    log.error('On trying to get histories list: ' + e)
  }
}
