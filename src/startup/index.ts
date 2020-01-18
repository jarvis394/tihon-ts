/**
 * Registers aliases for paths
 */
import ma from 'module-alias'

ma.addAliases({
  "@config": "./src/config",
  "@globals": "./src/globals",
  "@models": "./src/models",
  "@interfaces": "./src/interfaces",
  "@structures": "./src/structures",
  "@utils": "./src/utils",
  "@commands": "./src/commands"
})

console.clear()
import './env'
