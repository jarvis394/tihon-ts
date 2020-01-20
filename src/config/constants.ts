/**
 * Bot ID
 */
export const ID: number = Number(process.env.ID)

/**
 * Bot's group ID
 */
export const GROUP_ID: number = Number(process.env.GROUP_ID)

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
export const COMMAND_COOLDOWN: number = 1000

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
 * Battle starting price
 */
export const BATTLE_PRICE = 2500

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

/**
 * Interval between updating statistics table in the bot's group
 */
export const GROUP_STATS_UPD_INTERVAL = 3600 * 6 * 1000