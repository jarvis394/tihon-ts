exports.run = async (update, args) => {
  const rel = '../../../'
  const { db } = require(rel + 'globals')
  const format = require(rel + 'utils/format')
  const { random, randomArray } = require(rel + 'utils/random')
  const User = require(rel + 'lib/User')
  const Guild = require(rel + 'lib/Guild')
  const CommandError = require(rel + 'lib/CommandError')

  const { senderId } = update
  const user = new User(senderId)
  const guildId = await user.fetchGuild()

  // Return if guild is empty
  if (!guildId) {
    return update.reply(
      '😕 Ты не состоишь в колхозе\n\n' +
        'Глава колхоза может пригласить тебя командой /колхоз пригласить [id]'
    )
  }

  // Get info
  const guild = new Guild(guildId)
  const data = await guild.fetchData()

  if (!data) {
    return update.reply(
      `🔻 Колхоз с ID "${guildId}" не найден`
    )
  }

  class opponentGuild extends Guild {
    constructor(id) {
      super(id)

      this.winRate = random(50)
    }
  }
}

exports.command = {
  hidden: true,
}
