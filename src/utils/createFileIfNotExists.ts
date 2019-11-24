import fs from 'fs'
import log from '@globals/log'

export default (path: string) => fs.appendFile(path, '', err => err && log.error(err))
