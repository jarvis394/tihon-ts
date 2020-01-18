import db from '@globals/database'
import { api } from '@globals/vk'
import Database from 'better-sqlite3'
import { IUserModel, IUsersGetModel } from '@interfaces/User'
import IItem from '@models/Item'
import getUsersTop from '@utils/getUsersTop'
import { getGroupByItemId } from '@utils/shop'
import { USER as defaultData } from '@config/defaultData'
import { UsersGetParams } from 'vk-io/lib/api/schemas/params'
import { IPet } from '@interfaces/db'

export default class User {
  /**
   * User's ID
   */
  readonly id: number

  /**
   * User's stringified ID
   */
  readonly stringId: string

  /**
   * User class
   * @param id User's ID
   * @class
   */
  constructor(id: number | string) {
    this.id = Number(id)
    this.stringId = id.toString()

    const data: IUserModel = db
      .prepare(`SELECT * FROM main.users WHERE id = ${this.id}`)
      .get()
    if (!data) {
      this.setData(defaultData)
    }

    return this
  }

  /**
   * Sets data to db
   * @param {object} data Data to set
   */
  setData(data: IUserModel): Database.RunResult {
    data.id = this.id

    const st = db.prepare(
      'INSERT OR REPLACE INTO main.users (id, money, reputation, guild, hidden) VALUES (@id, @money, @reputation, @guild, @hidden);'
    )
    return st.run(data)
  }

  /**
   * Gets user's hidden status
   */
  get hidden(): boolean {
    return (
      db.prepare(`SELECT hidden FROM main.users WHERE id = ${this.id};`).get()
        .hidden === 'true'
    )
  }

  /**
   * Gets user's items
   */
  get items(): Record<string, IItem> | null {
    const data = db
      .prepare(`SELECT * from main.items WHERE userId = ${this.id};`)
      .all()

    let res: Record<string, IItem> = {}

    data.forEach(item => (res[item.groupName] = item))

    return res
  }

  /**
   * Gets user's pet
   */
  get pet(): IPet | null {
    const data = db
      .prepare(`SELECT * from main.pets WHERE userId = ${this.id};`)
      .get()

    return data
  }

  /**
   * Gets user's earnings
   */
  get earnings(): Record<string, number> {
    const data = db
      .prepare(`SELECT * from main.earnings WHERE userId = ${this.id};`)
      .all()

    let res: Record<string, number> = {}

    data.forEach(e => (res[e.field] = e.time))

    return res
  }

  /**
   * Gets user's amount
   */
  get money(): number {
    const data = db
      .prepare(`SELECT money FROM main.users WHERE id = ${this.id};`)
      .get().money
    return data
  }

  /**
   * Gets user's reputation
   */
  get reputation(): number {
    const data = db
      .prepare(`SELECT reputation FROM main.users WHERE id = ${this.id};`)
      .get().reputation
    return data
  }

  /**
   * Gets user's amount
   */
  get guild(): number {
    const data = db
      .prepare(`SELECT guild FROM main.users WHERE id = ${this.id};`)
      .get().guild
    return data
  }

  /**
   * Checks whether user can buy an item
   * @param {number} price Item's proce
   */
  isEnoughFor(price: number): { amount: number; state: boolean } {
    const amount = this.money
    const state = amount - price > 0

    return {
      amount,
      state,
    }
  }

  /**
   * Adds amount to the user's balance
   * @param {number} n Amount to add
   */
  add(n: number): Database.RunResult {
    return db
      .prepare(
        `UPDATE main.users SET money = ${this.money + n} WHERE id = ${this.id};`
      )
      .run()
  }

  /**
   * Subtracts amount from the user's balance
   * @param {numebr} n Amount to subtract
   */
  subtract(n: number): Database.RunResult | boolean {
    const m = this.money

    if (m - n < 0) return false

    return db
      .prepare(`UPDATE main.users SET money = ${m - n} WHERE id = ${this.id};`)
      .run()
  }

  /**
   * Adds amount to the user's rank
   * @param {number} n Amount to add
   */
  addReputation(n: number): Database.RunResult {
    return db
      .prepare(
        `UPDATE main.users SET reputation = ${this.reputation + n} WHERE id = ${
          this.id
        };`
      )
      .run()
  }

  /**
   * Removes amount from the user's rank
   * @param {number} n Amount to subtract
   */
  subtractReputation(n: number): Database.RunResult | boolean {
    const r = this.reputation

    if (r - n < 0) return false

    return db
      .prepare(
        `UPDATE main.users SET reputation = ${r - n} WHERE id = ${this.id};`
      )
      .run()
  }

  /**
   * Sets earning by field
   * @param {string} field Field to set
   * @param {number} time Time to set
   */
  setEarning(field: string, time: number): Database.RunResult {
    return db
      .prepare(
        `
      INSERT OR REPLACE INTO main.earnings (userId, field, time) VALUES (@userId, @field, @time);
    `
      )
      .run({
        userId: this.id,
        field,
        time,
      })
  }

  /**
   * Sets item in the user's inventory
   * @param {number} id Item's ID
   */
  setItem(id: number): IItem | false {
    const items = this.items
    const group = getGroupByItemId(id)

    // Check group existence
    if (!group) throw new Error(`Group ${id} was not found using utils.getGroupByItemId`)

    const { title: groupName } = group
    const dbGroup = items[groupName]

    // Check maximum in group
    if (dbGroup && 1 <= dbGroup.quantity) {
      return false
    }

    // Set data
    db.prepare(
      'INSERT OR REPLACE INTO items (userId, groupName, id, quantity) VALUES (@userId, @groupName, @id, @quantity);'
    ).run({
      userId: this.id,
      groupName: groupName,
      id,
      quantity: 1,
    })

    return this.items[groupName]
  }

  /**
   * Removes item from user's inventory
   * @param {string} group Group
   */
  removeItem(group: string): IItem | false {
    const item = this.items[group]

    // Check item
    if (!item) return null

    if (item.quantity - 1 <= 0) {
      db.prepare(
        `DELETE FROM main.items WHERE userId = ${this.id} AND groupName = '${group}';`
      ).run()
    } else {
      db.prepare(
        `
        UPDATE main.items 
        SET quantity = ${item.quantity - 1}
        WHERE userId = ${this.id} AND groupName = '${group}';
      `
      ).run()
    }

    return this.items[group] || null
  }

  /**
   * Set user's pet
   * @param {number} id Pet's ID
   * @returns timestamp - Date when the pet has been written in database
   */
  setPet(id: number): number | false {
    const pet = this.pet
    const timestamp = Date.now()

    // Check pet existence in user's data
    if (pet) {
      return false
    }

    // Set data
    db.prepare(
      'INSERT OR REPLACE INTO main.pets (userId, id, timestamp) VALUES (@userId, @id, @timestamp);'
    ).run({
      userId: this.id,
      id,
      timestamp,
    })

    return timestamp
  }

  /**
   * Removes pet from the user
   */
  removePet(): Database.RunResult | boolean {
    // Return false if no pet was found
    if (!this.pet) return false

    // Delete entry
    return db.prepare(`DELETE FROM main.pets WHERE userId = ${this.id};`).run()
  }

  /**
   * Sets user's guild
   * @param {string} id Guild's ID
   */
  setGuild(id: string | number): Database.RunResult {
    return db
      .prepare(`UPDATE main.users SET guild = ${id} WHERE id = ${this.id};`)
      .run()
  }

  /**
   * Returns the payload of the user's name
   * @param nameCase Name case
   */
  async getName(
    nameCase: UsersGetParams['name_case'] = 'nom'
  ): Promise<IUsersGetModel> {
    const response = await api.users.get({
      user_ids: this.stringId,
      name_case: nameCase,
    })

    return response[0] || null
  }

  /**
   * Returns the user's name
   * @param nameCase Name case
   */
  async getFullName(
    nameCase: UsersGetParams['name_case'] = 'nom'
  ): Promise<string | null> {
    const response = await api.users.get({
      user_ids: this.stringId,
      name_case: nameCase,
    })

    return response[0]
      ? response[0].first_name + ' ' + response[0].last_name
      : null
  }

  /**
   * Gets user's top position (0 < x <= 100)
   */
  getTopPlace(): null | number {
    const place = getUsersTop().findIndex((e: { id: any }) => e.id === this.id)

    if (place >= 0) return place + 1
    else return null
  }
}
