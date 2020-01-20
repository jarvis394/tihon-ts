import express from 'express'
import getUsersTop from '@utils/getUsersTop'
import commands from '@globals/commands'
import { SECRET } from '@config/keys'
import * as promo from '@utils/promo'
import randomMessage from '@utils/randomMessage'
const router = express.Router()

router.get('/', (_, res) => res.send('woop woop woop'))
router.get('/commands', (_, res) => res.json({ commands }))
router.get('/cmdList', (_, res) => res.json({ commands }))
router.get('/generate', async (_, res) => res.json(await randomMessage()))
router.post('/generatePromo', async (req, res) => {
  if (req.body.secret !== SECRET) return res.sendStatus(403)

  const data = promo.generate()

  return res.json(data)
})

module.exports = router
