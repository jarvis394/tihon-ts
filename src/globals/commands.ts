import fs from 'fs'
import log from './log'
import path from 'path'
const COMMANDS_PATH: string = path.join(__dirname, '..', 'commands')

let commands = []
fs.readdirSync(COMMANDS_PATH).forEach(groupName => {
  fs.readdirSync(COMMANDS_PATH + '/' + groupName).forEach(commandName => {
    try {
      const command = require('../commands/' + groupName + '/' + commandName).command
      if (command.hidden) return false

      command.group = groupName
      command.name = commandName.split('.')[0]
      commands.push(command)
    } catch (e) {
      log.error('On parsing commands: ' + e)
      console.error(e)
    }
  })
})

log.debug('Loaded ' + commands.length + ' commands')

export default commands
