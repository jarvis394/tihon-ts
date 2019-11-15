import Database from 'better-sqlite3'
import IItem from './Item'
import IPet from './Pet'
import { UsersGetParams } from 'vk-io/lib/api/schemas/params'

export interface IUsersGetModel {
  first_name: string
  last_name: string
  [key: string]: any
}

export interface IUser {
  /**
   * User's ID
   */
  readonly id: number

  /**
   * User's stringified ID
   */
  readonly stringId: string

  /**
   * Gets user's amount
   */
  readonly money: number

  /**
   * Gets user's reputation
   */
  readonly reputation: number

  /**
   * Gets user's amount
   */
  readonly guild?: number

  /**
   * Gets user's hidden status
   */
  readonly hidden: boolean

  /**
   * Gets user's items
   */
  readonly items: Record<string, IItem> | {}

  /**
   * Gets user's pet
   */
  readonly pet: IPet | null

  /**
   * Gets user's earnings
   */
  readonly earnings: Record<string, number>

  /**
   * Sets data to db
   * @param {object} data Data to set
   */
  setData(data: IUserModel): Database.RunResult

  /**
   * Checks whether user can buy an item
   * @param {number} price Item's proce
   */
  isEnoughFor(price: number): { amount: number; state: boolean }

  /**
   * Adds amount to the user's balance
   * @param {number} n Amount to add
   */
  add(n: number): Database.RunResult

  /**
   * Subtracts amount from the user's balance
   * @param {numebr} n Amount to subtract
   */
  subtract(n: number): Database.RunResult | boolean

  /**
   * Adds amount to the user's rank
   * @param {number} n Amount to add
   */
  addReputation(n: number): Database.RunResult

  /**
   * Removes amount from the user's rank
   * @param {number} n Amount to subtract
   */
  subtractReputation(n: number): Database.RunResult | boolean

  /**
   * Sets earning by field
   * @param {string} field Field to set
   * @param {number} time Time to set
   */
  setEarning(field: string, time: number): Database.RunResult

  /**
   * Sets item in the user's inventory
   * @param {number} id Item's ID
   */
  setItem(id: number): IItem | false

  /**
   * Removes item from user's inventory
   * @param {string} group Group
   */
  removeItem(group: number): IItem | false

  /**
   * Set user's pet
   * @param {number} id Pet's ID
   * @returns timestamp - Date when the pet has been written in database
   */
  setPet(id: number): number | false

  /**
   * Removes pet from the user
   */
  removePet(): Database.RunResult | boolean

  /**
   * Sets user's guild
   * @param {string} id Guild's ID
   */
  setGuild(id: string | number): Database.RunResult

  /**
   * Returns the payload of the user's name
   * @param nameCase Name case
   */
  getName(nameCase: UsersGetParams['name_case']): Promise<IUsersGetModel>

  /**
   * Returns the user's name
   * @param nameCase Name case
   */
  getFullName(nameCase: UsersGetParams['name_case']): Promise<string | null>

  /**
   * Gets user's top position (0 < x <= 100)
   */
  getTopPlace(): null | number
}

export interface IUserModel {
  id?: number
  money: number
  reputation: number
  guild?: number
  hidden: string
}
