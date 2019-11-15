module.exports = path => {
  const fs = require('fs')
  const log = require('../globals/log')

  return fs.appendFile(path, '', err => err && log.error(err))
}
