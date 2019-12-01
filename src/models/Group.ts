import extend from 'extend'

export default class Group {
  category: string
  icon: string
  profileName: string
  title: string
  name: string
  id?: number

  constructor(options: Group) {
    extend(this, options)
  }
}
