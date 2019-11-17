/**
 * Returns dialogs list
 */
export const getDialogs = async () => {
  const data = require('../../temp/dialogs.json')
  return data.items
}

/**
 * Returns histories list
 */
export const getHistories = () => {
  const data = require('../../temp/messages.json')
  return data.response
}
