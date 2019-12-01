import extend from 'extend'

export default class Pet {
  icon: string
  name: string
  price: number
  id?: number
  
  constructor(options: Pet) {
    extend(this, options)
  }
}
