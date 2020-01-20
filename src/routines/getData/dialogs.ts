import log from '@globals/log'
import { collect } from '@globals/vk'
import events from '@structures/Events'
import fs from 'fs'
import path from 'path'
import createFileIfNotExists from '@utils/createFileIfNotExists'

const amount = 50

export default () => {
  const dialogsFilePath = path.resolve('temp/dialogs.json')
  const stream = collect.messages.getConversations({ extended: 0, count: amount })

  createFileIfNotExists(dialogsFilePath)

  /*if (process.env.MODE === 'DEVELOPMENT')
    return events.emit('getDialogsSuccess')*/
  
  // @ts-ignore
  stream.on('error', (e) => log.error('On trying to get dialogs:\n' + e))
  
  // @ts-ignore
  stream.on('data', (data) => {
    fs.writeFile(dialogsFilePath, JSON.stringify(data), err => {
      if (err) return log.error('On trying to write dialogs list: ' + err)

      log.debug(`Got ${data.total} dialogs`, { private: true })

      return events.emit('getDialogsSuccess')
    })
  })
}
