const express = require('express')
const router = express.Router()
const shopData = require('@config/data/shop').default
const guildShopData = require('@config/data/guildShop').default
const promoData = require('@config/data/promo').default

router.get('/itemsShop', (_, res) => res.json(shopData))
router.get('/guildShop', (_, res) => res.json(guildShopData))
router.get('/promo', (_, res) => res.json(promoData))

module.exports = router
