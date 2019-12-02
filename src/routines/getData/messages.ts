import events from '@structures/Events'
import fs from 'fs'
import path from 'path'
import log from '@globals/log'
import { collect } from '@globals/vk'
import createFileIfNotExists from '@utils/createFileIfNotExists'
import { getDialogs } from '@utils/data'
import { MessagesConversation } from 'vk-io'

export default () => {
  const dialogsFilePath = path.resolve('temp/dialogs.json')
  const messagesFilePath = path.resolve('temp/messages.json')

  createFileIfNotExists(dialogsFilePath)

  // if (process.env.MODE === 'DEVELOPMENT')
  //   return events.emit('getMessagesSuccess')

  const data = getDialogs()
  const amount = data.length > 50 ? 50 : data.length

  const executeItems = data.slice(0, amount).map((el: MessagesConversation) => ({
    peer_id: el.conversation.peer.id,
    count: 100,
    offset: 0,
  }))

  collect.executes('messages.getHistory', executeItems).then(data => {
    if (data.errors.length !== 0) {
      data.errors.forEach(e => log.error('On getting messages: ' + e))
    }

    fs.writeFile(messagesFilePath, JSON.stringify(data), err => {
      if (err) return log.error('On trying to write messages list: ' + err)

      log.info('Got messages history for ' + amount + ' dialogs', {
        private: true,
      })
      return events.emit('getMessagesSuccess')
    })
  })
}
