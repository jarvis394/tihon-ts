import { MessageContext } from 'vk-io'

interface LanguageList {
  en: string
  ru: string
}

export default interface ICommand {
  info: {
    /**
     * Command arguments
     */
    arguments: LanguageList

    /**
     * Command descrpition
     */
    description: LanguageList

    /**
     * Command aliases
     */
    alias: string[]

    /**
     * Command group name
     */
    group: string

    /**
     * Command name
     */
    name: string
  }

  /**
   * Async function that runs the command
   */
  run: (options: {
    update: MessageContext
    args?: string[]
    mentionCmdState?: boolean
  }) => Promise<any>
}
