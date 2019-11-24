import * as math from 'mathjs'

export const run = async ({ update, args }) => {
  const calc: string = args.join(' ')
  let resp: string
  
  try {
    resp = math.evaluate(calc)
  } catch (e) {
    throw new Error('Похоже, я слишком тупой для таких примеров')
  }

  return update.reply(`📥 Ввод: ${calc}\n📤 Результат: ${resp}`)
}

export const command = {
  name: 'calc',
  arguments: {
    ru: '',
    en: '',
  },
  description: {
    en: 'Calculate something',
    ru: 'Посчитать матан',
  },
  alias: ['калк', 'калькулятор', 'калкулятор', 'счет', 'счёт'],
  group: 'utils',
}
