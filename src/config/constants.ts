/**
 * Bot ID
 */
export const ID: number = Number(process.env.ID)

/**
 * Bot prefix
 */
export const PREFIX: string = '/'

/**
 * Mention prefix
 */
export const MENTION_PREFIX: string = '[id' + ID.toString() + '|'

/**
 * Currency sign
 */
export const CURRENCY: string = '₮'

/**
 * Cooldown between commands
 * (3 seconds)
 */
export const COMMAND_COOLDOWN: number = 3000

/**
 * Cooldown between /anon commands
 * (2 minmutes)
 */
export const ANON_COOLDOWN: number = 1000 * 60 * 2

/**
 * Cooldown between /battle commands
 * (2 minutes)
 */
export const BATTLE_COOLDOWN: number = 1000 * 60 * 2

/**
 * Interval between auto-sending random messages
 * (3 hours)
 */
export const AUTO_INTERVAL: number = 3600 * 3 * 1000

/**
 * Interval between getting data
 * (3 hours)
 */
export const DATA_GET_INTERVAL: number = 3600 * 3 * 1000

/**
 * Daily bonus for user
 */
export const DAILY_BONUS: number = 5000
