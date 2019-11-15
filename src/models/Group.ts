import { Group as IGroup } from '../interfaces'

export default class Group {
  category: string
  icon: string
  profileName: string
  title: string
  name: string
  id?: number
  
  constructor(options: IGroup) {
    for (const option in options) {
      this[option] = options[option]
    }
  }
}
