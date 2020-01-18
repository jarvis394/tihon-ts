exports.run = async ({ update, args }) => {
  update.reply('👌')
  process.kill(process.pid)
}

exports.command = {
  hidden: true,
}
