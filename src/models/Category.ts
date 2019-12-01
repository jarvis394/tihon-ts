import extend from 'extend'

export default class Category {
  icon: string
  name: string
  
  constructor(options: Category) {
    extend(this, options)
  }
}
