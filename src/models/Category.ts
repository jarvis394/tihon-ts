import { Category as ICategory } from '../interfaces'

export default class Category {
  icon: string
  name: string
  
  constructor(options: ICategory) {
    for (const option in options) {
      this[option] = options[option]
    }
  }
}
