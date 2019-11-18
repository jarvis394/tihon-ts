import db from '../globals/database'
import * as vk from '../globals/vk'
import Database from 'better-sqlite3'
import { IUser, IUserModel, IUsersGetModel } from '../interfaces/User'
import { Item as IItem, Pet as IPet } from '../interfaces'
import getUsersTop from '../utils/getUsersTop'
import { getGroupByItemId } from '../utils/shop'
import { USER as defaultData } from '../config/defaultData'
import { UsersGetParams } from 'vk-io/lib/api/schemas/params'

const { api } = vk

export default class User implements IUser {
  public id: number
  public stringId: string

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

  setData(data: IUserModel): Database.RunResult {
    data.id = this.id

    const st = db.prepare(
      'INSERT OR REPLACE INTO main.users (id, money, reputation, guild, hidden) VALUES (@id, @money, @reputation, @guild, @hidden);'
    )
    return st.run(data)
  }

  get hidden(): boolean {
    return (
      db.prepare(`SELECT hidden FROM main.users WHERE id = ${this.id};`).get()
        .hidden === 'true'
    )
  }

  get items(): Record<string, IItem> | null {
    const data = db
      .prepare(`SELECT * from main.items WHERE userId = ${this.id};`)
      .all()

    let res: Record<string, IItem> = {}

    data.forEach(item => (res[item.groupName] = item))

    return res
  }

  get pet(): IPet | null {
    const data = db
      .prepare(`SELECT * from main.pets WHERE userId = ${this.id};`)
      .get()

    return data
  }

  get earnings(): Record<string, number> {
    const data = db
      .prepare(`SELECT * from main.earnings WHERE userId = ${this.id};`)
      .all()

    let res: Record<string, number> = {}

    data.forEach(e => (res[e.field] = e.time))

    return res
  }

  get money(): number {
    const data = db
      .prepare(`SELECT money FROM main.users WHERE id = ${this.id};`)
      .get().money
    return data
  }

  get reputation(): number {
    const data = db
      .prepare(`SELECT reputation FROM main.users WHERE id = ${this.id};`)
      .get().reputation
    return data
  }

  get guild(): number {
    const data = db
      .prepare(`SELECT guild FROM main.users WHERE id = ${this.id};`)
      .get().guild
    return data
  }

  isEnoughFor(price: number): { amount: number; state: boolean } {
    const amount = this.money
    const state = amount - price > 0

    return {
      amount,
      state,
    }
  }

  add(n: number): Database.RunResult {
    return db
      .prepare(
        `UPDATE main.users SET money = ${this.money + n} WHERE id = ${this.id};`
      )
      .run()
  }

  subtract(n: number): Database.RunResult | boolean {
    const m = this.money

    if (m - n < 0) return false

    return db
      .prepare(`UPDATE main.users SET money = ${m - n} WHERE id = ${this.id};`)
      .run()
  }

  addReputation(n: number): Database.RunResult {
    return db
      .prepare(
        `UPDATE main.users SET reputation = ${this.reputation + n} WHERE id = ${
          this.id
        };`
      )
      .run()
  }

  subtractReputation(n: number): Database.RunResult | boolean {
    const r = this.reputation

    if (r - n < 0) return false

    return db
      .prepare(
        `UPDATE main.users SET reputation = ${r - n} WHERE id = ${this.id};`
      )
      .run()
  }

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

  removeItem(group: number): IItem | false {
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

  removePet(): Database.RunResult | boolean {
    // Return false if no pet was found
    if (!this.pet) return false

    // Delete entry
    return db.prepare(`DELETE FROM main.pets WHERE userId = ${this.id};`).run()
  }

  setGuild(id: string | number): Database.RunResult {
    return db
      .prepare(`UPDATE main.users SET guild = ${id} WHERE id = ${this.id};`)
      .run()
  }

  async getName(
    nameCase: UsersGetParams['name_case'] = 'nom'
  ): Promise<IUsersGetModel> {
    const response = await api.users.get({
      user_ids: this.stringId,
      name_case: nameCase,
    })

    return response[0] || null
  }

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

  getTopPlace(): null | number {
    const place = getUsersTop().findIndex((e: { id: any }) => e.id === this.id)

    if (place >= 0) return place + 1
    else return null
  }
}
