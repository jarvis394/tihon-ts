interface LanguageList {
  en: string,
  ru: string
}

export default interface ICommand {
  /**
   * Command information
   */
  info: {
    arguments: LanguageList,
    description: LanguageList,
    alias: string[],
    group: string,
    name: string
  }
  
  /**
   * Async function that runs the command
   */
  run: (options: Record<any, any>) => Promise<any>
}
