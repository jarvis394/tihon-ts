export default interface IItem {
  /**
   * Item's icon
   */
  icon: string

  /**
   * Item's name
   */
  name: string

  /**
   * Item's price
   */
  price: number

  /**
   * Item's ID
   */
  id?: number

  /**
   * Item's group ID
   */
  groupId?: number

  /**
   * Item's group
   */
  group: string

  /**
   * Item's hourly money earning
   */
  earning?: number

  /**
   * Item's reputation increment
   */
  rep: number

  /**
   * Amount of items
   */
  quantity?: number
}
