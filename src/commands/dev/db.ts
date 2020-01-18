import db from '@globals/database'

/* eslint-disable no-unexpected-multiline */
exports.run = async ({ update, args }) => {
  const res = JSON.stringify(db
    .prepare(args.slice(0, args.length - 1).join(' '))
    [args[args.length - 1]]()) || 'ℹ️ Nothing was returned'

  return update.reply(res)
}

exports.command = {
  hidden: true,
}
