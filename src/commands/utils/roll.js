exports.run = async ({ args }) => {
  const { random } = require('../../utils/random')

  let res = random(0, 100)

  if (args[0] && !args[1] && !isNaN(args[0])) {
    res = random(0, args[0])
  } else if (args[0] && args[1] && (!isNaN(args[0]) && !isNaN(args[1]))) {
    res = random(args[0], args[1])
  }

  return res
}

exports.command = {
  name: 'roll',
  arguments: '(min) (max)|(min) (max)',
  description: {
    en: 'Roll from 0 (or min) to 100 (or max)',
    ru: 'Ролл от 0 (или min) до 100 (или max)',
  },
  group: 'utils',
}
