export default interface ICommand {
  info: {
    arguments: {
      en: string
      ru: string
    }
  }

  run: (options: Record<any, any>) => Promise<any>
}
