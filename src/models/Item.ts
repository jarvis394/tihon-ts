import { Item as IItem } from '../interfaces'

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
  
  constructor(options: IItem) {
    for (const option in options) {
      this[option] = options[option]
    }
  }
}
