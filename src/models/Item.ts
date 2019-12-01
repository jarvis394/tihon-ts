import extend from 'extend'

export default class Item {
  icon: string
  name: string
  price: number
  id?: number
  groupId?: number
  group: string
  earning?: number
  rep: number
  quantity?: number
  
  constructor(options: Item) {
    extend(this, options)
  }
}
