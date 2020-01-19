/**
 * Registers aliases for paths
 */
import ma from 'module-alias'
import path from 'path'

ma.addAliases({
  "@config": path.resolve("./src/config"),
  "@globals": path.resolve("./src/globals"),
  "@models": path.resolve("./src/models"),
  "@interfaces": path.resolve("./src/interfaces"),
  "@structures": path.resolve("./src/structures"),
  "@utils": path.resolve("./src/utils"),
  "@commands": path.resolve("./src/commands")
})

console.clear()
import './env'

