import { randomArray } from '@utils/random'
import { api } from '@globals/vk'
import db from '@globals/database'
import * as blacklist from '@config/blacklist'

exports.run = async ({ update }) => {
  // Get dialogs
  var Dialogs = await api.messages.getConversations({
    count: 200,
  })

  async function getMsg() {
    var Dialog = randomArray(Dialogs.items)

    let data = db
      .prepare(
        `SELECT * FROM main.dialogs WHERE id = ${Dialog.conversation.peer.id}`
      )
      .get()

    if (!data || data.canReadMessages === false) data = { canReadMessages: true }

    while (!data.canReadMessages) {
      Dialog = randomArray(Dialogs.items)
    }

    var Photos = await api.messages.getHistoryAttachments({
      peer_id: Dialog.conversation.peer.id,
      count: 200,
      media_type: 'photo',
    })

    // Return false if no photos in dialog
    if (!Photos.items) return false

    var Photo = randomArray(Photos.items)

    return Photo
  }

  let ph = await getMsg()

  while (
    !ph ||
    blacklist.USERS.some(e => e === ph.attachment.photo.owner_id.toString())
  ) {
    // eslint-disable-next-line require-atomic-updates
    ph = await getMsg()
  }

  var access = ph.attachment.photo.access_key
    ? '_' + ph.attachment.photo.access_key
    : ''

  await update.send('', {
    attachment: `photo${ph.attachment.photo.owner_id}_${ph.attachment.photo.id}${access}`,
  })
}

exports.command = {
  name: 'photo',
  arguments: false,
  description: {
    en: 'Sends random photo from other multidialogs',
    ru: 'Отправить рандомное фото из других бесед',
  },
  alias: ['фото', 'фотка'],
  group: 'random',
  hidden: false
}
