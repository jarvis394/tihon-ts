import User from '@models/User'
import * as shopData from '@config/data/shop'
import { api } from '@globals/vk'

exports.run = async ({ update, args }) => {
  const aliases = {
    buy: ['buy', 'купить', 'купитт', 'купля', 'куплч'],
    sell: ['sell', 'продать', 'продат', 'продатб', 'продажа'],
  }

  let option = args[0]
  if (!option) return sendPetsMenu()
  if (aliases.buy.some(e => e == option)) return sendBuyMenu(option)
  if (aliases.sell.some(e => e == option)) return sendSellMenu(option)

  return update.send('🤔 Такой опции нет')

  async function sendPetsMenu() {
    let { senderId: id } = update
    let user = new User(id)

    let pet = user.pet
    let res = ['']

    if (!pet) return update.send('Пока ничего')
  }

  async function sendMenu() {
    const name = await api.users.get({
      user_ids: update.senderId,
      name_case: 'gen',
    })
    let res = [name[0].first_name + ', разделы магазина:', '']

    for (let pet in shopData.pets) {
      const { name, id, icon, price } = shopData.pets[pet]
      res.push(`  [ ${id} ] ${icon} ${name} - ${price}T`)
    }

    res.push('')
    res.push('Чтобы купить питомца, напишите его [ ID ]:')
    res.push('@tihon_bot, питомец купить 7')

    update.send(res.join('\n'))
  }

  async function sendBuyMenu(option) {
    let name = await api.users.get({
      user_ids: update.senderId,
      name_case: 'gen',
    })
    let user = new User(update.senderId)

    if (!args[1]) {
      return await sendMenu()
    }

    if (isNaN(args[1])) {
      return update.send('😕 ID - это число, знаешь.')
    }

    const id = parseInt(args[1])
    const pet = shopData.pets.find(i => i.id === id)
    const { amount, state } = await user.isEnoughFor(pet.price)
    const userPet = user.pet

    /*if (pets.length >= 3)
      return update.reply('✖️ Нельзя иметь больше 3-х питомцев')
    */
    
    if (!state) {
      return update.send(
        '🧮 Недостаточно денег - у тебя ' +
          + amount +
          'T, а нужно ' +
          pet.price +
          'T'
      )
    }

    user.subtract(pet.price)
    user.setPet(pet.id)

    return update.send(
      `🎉 Теперь у ${name[0].first_name} владеет животным ${pet.name}\n` +
        '\nЧтобы продать, нужно написать после команды слово "продать питомца"'
    )
  }

  async function sendSellMenu(option) {
    let name = await api.users.get({
      user_ids: update.senderId,
    })
    let user = new User(update.senderId)

    if (!args[1]) {
      return update.send('😕 Ты не ввел номер питомца, который хочешь продать')
    }

    if (isNaN(args[1])) {
      return update.send('😕 Номер - это число, знаешь.')
    }

    let n = parseInt(args[1]) - 1
    let id = user.pet.id
    let item = shopData.pets.find(i => i.id === id)

    if (!id) {
      return update.send('🧮 У тебя нет питомца')
    }

    if (!item) {
      return update.send('❌ У тебя есть несуществующий питомец')
    }

    user.add(item.price / 2)
    user.removePet()

    return update.send(
      `🎉 ${name[0].first_name} продал питомца ${item.name} за ${item.price / 2}T`
    )
  }
}

exports.command = {
  arguments: false,
  description: {
    en: 'Buy, sell or manage your pet',
    ru: 'Купить, продать, менять животное',
  },
  alias: ['животное', 'питомец'],
  hidden: false,
}
