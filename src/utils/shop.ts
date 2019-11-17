import { items, groups, pets } from '../config/data/shop'

/**
 * Gets group by its groupID
 * @param {number} id Group ID
 */
export const getGroupById = (id: number) => groups.find(i => i.id === id)

/**
 * Gets group by one of its itemsID
 * @param {number} id Item ID
 */
export const getGroupByItemId = (id: number) => {
  const g = items.find(i => i.id === id)

  if (!g) return false
  else return getGroupById(g.groupId)
}

/**
 * Gets group by its title
 * @param {string} title Group title
 */
export const getGroupByTitle = (title: string) => groups.find(i => i.title === title)

/**
 * Gets group by its profileName
 * @param {string} name Group profileName
 */
export const getGroupByProfileName = (name: string) =>
  groups.find(i => i.profileName.toLowerCase() === name.toLowerCase())

/**
 * Gets group by its name
 * @param {string} name Group name
 */
export const getGroupByName = (name: string) =>
  groups.find(i => i.name.toLowerCase() === name.toLowerCase())

/**
 * Gets item by its ID
 * @param {number} id Item ID
 */
export const getItemById = (id: number) => items.find(i => i.id === id)

/**
 * Gets item by its groupID
 * @param {number} id Item groupID
 */
export const getItemsByGroupId = (id: number) => items.filter(i => i.groupId === id)

/**
 * Gets pet by its ID
 * @param {number} id Pet ID
 */
export const getPetById = (id: number) => pets.find(i => i.id === id)
