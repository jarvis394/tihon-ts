const { random } = require('../utils/random')
const fs = require('fs')
const path = require('path')
const promos = require('../config/data/promo')

const promoFunction = async (f, u) => {
  await f(u)
  return true
}

/**
 * Generates promo
 */
const generate = () => {
  const { log } = require('../globals')

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
const getPromo = () => {
  const { log } = require('../globals')

  let data

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

module.exports = {
  promoFunction,
  generate,
  getPromo,
}
