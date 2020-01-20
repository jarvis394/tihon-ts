const express = require('express')
const getUsersTop = require('@utils/getUsersTop').default
const User = require('@models/User').default
const router = express.Router()

router.get('/statistics', (_, res) => res.json(getUsersTop()))
router.get('/:id', (req, res) => {
  const { id } = req.params

  if (isNaN(id)) {
    res.status(402)
    return res.json({
      code: 402,
      error: '\'id\' field should be a Number',
    })
  }

  const user = new User(id)

  return res.json({
    money: user.money,
    reputation: user.reputation,
    items: user.items,
    earnings: user.earnings,
    guild: user.guild,
    hidden: user.hidden,
    id: user.id,
  })
})

module.exports = router
