import { GuildItem as IGuildItem } from '../interfaces'

export default class GuildItem {
  id: number
  name: string
  icon: string
  price: number
  accName?: string
  multName?: string
  rep: number
  boost: number
  group: string
  
  constructor(options: IGuildItem) {
    for (const option in options) {
      this[option] = options[option]
    }
  }
}
