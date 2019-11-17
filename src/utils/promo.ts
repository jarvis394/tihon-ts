import { random } from './random'
import fs from 'fs'
import path from 'path'
import promos from '../config/data/promo'
import log from '../globals/log'

export const promoFunction = (f: (u: any) => void, u: any) => f(u)

/**
 * Generates promo
 */
export const generate = () => {
  const key = random(10000000, 99999999)
  const n = random(0, promos.length - 1)
  const promo = promos[n]
  const timestamp = Date.now()

  fs.writeFile(
    path.resolve('temp/promo.json'),
    JSON.stringify({ code: key, timestamp, n, promo }),
    err => {
      if (err) {
        log.error(err)
      } else {
        log.info(
          'Generated new key: ' + key + '\n          Timestamp: ' + timestamp
        )
      }
    }
  )

  return {
    code: key,
    n,
    promo,
    timestamp,
  }
}

/**
 * Gets current promo
 */
export const getPromo = () => {
  let data: Record<string, any>

  try {
    data = require('../temp/promo.json')
  } catch (e) {
    data = {}
    fs.writeFile(path.resolve('temp/promo.json'), JSON.stringify(data), err => {
      if (err) {
        log.error(err)
      } else {
        log.warn("No 'promo.json' found; created then")
      }
    })
  }

  return data
}
