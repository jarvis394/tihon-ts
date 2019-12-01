import extend from 'extend'

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
  
  constructor(options: GuildItem) {
    extend(this, options)
  }
}
