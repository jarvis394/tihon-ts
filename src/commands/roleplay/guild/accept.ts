import User from '@models/User'
import Guild from '@models/Guild'

exports.run = async (update, args) => {
  if (!args[1]) {
    return update.reply('🔻 Укажи ID колхоза')
  }

  const { senderId } = update
  const guildId = args[1]
  const user = new User(senderId)
  const userGuild = user.guild

  if (userGuild) {
    return update.reply('🔻 Ты уже состоишь в колхозе! Сначала выйди из него (/колхоз выйти), а потом принимай приглашение')
  }

  const guild = new Guild(guildId)
  const data = guild.members

  if (!data) {
    return update.reply('🔻 Колхоз с ID ' + guildId + ' не найден')
  }

  const member = data.find(e => e.id === senderId)

  if (!member) {
    return update.reply('🔻 Вас сюда не приглашали')
  }

  if (member.role > 0) {
    return update.reply('🔻 Вы уже состоите в этом колхозе')
  }

  if (data.filter(e => e.role > 0).length >= 50) {
    return update.reply('🔻 В колхозе может быть максимум 50 человек')
  }

  guild.changeRole(senderId, 1)

  user.setGuild(guildId)

  return update.reply(`✅ Ты был принят в колхоз "${guild.name}"`)
}

exports.command = {
  hidden: true,
}
