import * as blacklist from '@config/blacklist'
import { ID } from '@config/constants'
import commandLogger from '../structures/CommandLogger'
import { randomArray } from './random'
import isUrl from './isUrl'
import * as dataUtils from './data'
import db from '@globals/database'
import { Attachment } from 'vk-io'
import { IMessageContextPayload } from 'vk-io/lib/structures/contexts/message'

/**
 * Returns random message from multidialogs
 *
 * @returns {object} Message object
 */
export default async (): Promise<IMessageContextPayload['message']> => {
  const testMessage = (m: IMessageContextPayload['message']) => {
    if (!m) return true

    return (
      !m.text ||
      m.text.split(' ').some(t => isUrl(t)) ||
      m.text.split(' ').some(t => t.startsWith('+7')) ||
      m.text.split(' ').some(t => t.startsWith('/')) ||
      m.text.split(' ').some(t => t.startsWith('🔻')) ||
      m.text.length > 200 ||
      m.from_id.toString() === ID.toString() ||
      m.text.split(' ').some(t => t.startsWith('[id') || t.startsWith('[club')) ||
      m.from_id < 0
    )
  }

  const testAttachments = (m: IMessageContextPayload['message']) => {
    let flag = false

    m.attachments.forEach((a: Attachment) => {
      if (blacklist.USERS.some((e: number) => e === a[a.type].owner_id.toString())) {
        flag = true
      }
    })

    return flag
  }

  const canRead = (m: IMessageContextPayload['message']) => {
    const data = db
      .prepare(`SELECT * FROM main.dialogs WHERE id = ${m.peer_id}`)
      .get()

    if (data) {
      return data.canReadMessages === 'true'
    } else {
      return true
    }
  }

  function getMsg() {
    const histories = dataUtils.getHistories()
    const dialogHistory = randomArray(histories)
    const message = randomArray(dialogHistory.items)

    return message
  }

  let msg = getMsg()
  let i: number = 0

  while ((testMessage(msg) || testAttachments(msg) /*|| !canRead(msg)*/) && i < 10) {
    msg = getMsg()
    i++
  }

  // Log message to command.log
  // @ts-ignore
  commandLogger.random({
    message: msg,
  })

  return msg
}
