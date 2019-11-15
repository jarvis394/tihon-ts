import { Pet as IPet } from '../interfaces'

export default class Pet {
  icon: string
  name: string
  price: number
  id?: number
  
  constructor(options: IPet) {
    for (const option in options) {
      this[option] = options[option]
    }
  }
}
