import { ADMINS } from '../config/admins'

/**
 * Checks whether user is admin by ID
 * @param {string|number} i User ID
 */
export default (i: number | string): boolean =>
  ADMINS.some(id => id.toString() === i.toString())
