import moment from 'moment'
import handleError from '@utils/handleError'
import { randomArray, random } from '@utils/random'
import User from '@models/User'
import { ID, BATTLE_COOLDOWN, BATTLE_PRICE } from '@config/constants'
import { api } from '@globals/vk'
import { timeouts } from '@globals/storages'

type IHistoryCategories = 'beginning' | 'middle' | 'ending' | 'filling'

/* eslint-disable require-atomic-updates */
exports.run = async ({ update, args }) => {
  const histories = {
    beginning: [
      '%PLAYER% сразу ебашит с ноги!',
      'Неплохое начало! %PLAYER% делает резкий выпад!',
      'Шикарный левый хук от %PLAYER% открывает драку!',
      'Хорошее начало: %PLAYER% бьёт сразу в грудь своему противнику!',
      'Алкоголь, похоже, ударил в голову: %PLAYER% кидается во внезапную атаку!',
      '%PLAYER_ACC% валит противника на землю, правда, ненадолго.',
      '%PLAYER% фигачит кручёный удар! Как? Спросите у Балтики 9!',
    ],
    middle: [
      'Бой продолжается ударом пьяной головы %PLAYER_ACC%',
      'Реально нереально: удар ногой с разворота от %PLAYER_ACC% после водки с помидорным соком!',
      'Невозможно! УДАР БОГА! %PLAYER% - просто монстр, конечно.',
      'Неплохой хук от %PLAYER%',
      'Блестящий удар от %PLAYER%!',
      'Участники боя ходят вокруг да около... Нет, %PLAYER% внезапно нападает!',
      'Ещё удар от %PLAYER%!',
    ],
    ending: [
      'Хороший конец бывает только в сказке! %PLAYER% добивает противника!',
      '%PLAYER% не упускает возможность хорошенько вмазать противнику... Да, бой был неплох.',
      'Бывает и такое: у противника %PLAYER_ACC% нарисовался простатит и бой оканчивается!',
      '%PLAYER% прыгает сверху и сразу же загоняет перо под ребро!',
      '%PLAYER% ссыт на лицо проигравшему',
      '%PLAYER% обкончал жопу врага и скрылся',
      '%PLAYER% затроллил своего противника))',
      'А потом %PLAYER% снимает с противника трусы, в наручниках кидается на врага, как тигр, раздевает и начинает совать, а его бывший оппонент прижимает его к себе. И начинает входить глубоко и жестко',
    ],
    filling: [
      '%PLAYER% как лох ударяет в крысу!',
      '%PLAYER% ест хлеб и силы сразу прибавляются! Он выносит своего противника с одной левой!',
      '%PLAYER% наносит сокрушительно богатырский удар по зубам!',
      'Сила удара %PLAYER_ACC% настолько велика, что тот рвет рубашку на противнике и валит его на пол с криками "Fuck you"',
      '%PLAYER% делает подсечку, из-за чего противник разваливается на земле словно совок',
      '%PLAYER% наносит удар бутылкой из под Охоты',
      '%PLAYER% харкает оппоненту  в лицо и бьёт по яйцам',
      '%PLAYER%, разорвав руками банку пива, набрасывается на противника с криками "Ты че валчара!!"',
      '%PLAYER% дает дедовского леща',
      '%PLAYER% зовет собутыльников и устраивает групповой забив',
      '%PLAYER% бросает песок в лицо противника а затем бьет ногой в живот',
      '%PLAYER% тушит сигу об лицо противника',
      '%PLAYER% проверил прочность пресса своего оппонента',
    ],
  }

  class Opponent extends User {
    name: { nom: string; acc: string; short: string; }
    hp: number
    strength: number
    
    constructor(id: number) {
      super(id)

      this.name = { nom: '', acc: '', short: '' }
      this.hp = 100
      this.strength = 0.95 - 0.5 + Math.random() * (1 - 0.95 + 1)
    }

    decreaseHP(amt: number) {
      amt = Math.round(amt * this.strength)

      if (this.isDead(this.hp - amt)) {
        return false
      } else {
        return (this.hp -= amt)
      }
    }

    isDead(hp: number = this.hp) {
      return hp <= 0
    }
  }

  let opponentId: number
  const { senderId } = update
  try {
    opponentId = parseInt(args[0].split('|')[0].slice(3))
    if (isNaN(opponentId)) throw new Error('argument \'opponentId\' is NaN')
    if (update.senderId === opponentId) throw new Error('ids are same')
  } catch (e) {
    return update.reply(
      '👿 Тебе нужен человек для драки, состоящий в беседе\n\nПример использования: @tihon_bot драка *id1'
    )
  }
  
  const chatUsers = (await api.execute({
    code: `
      var members = API.messages.getConversationMembers({
        "peer_id": ${update.peerId},
        "fields": "first_name,last_name"
      });
      return { 
        "profiles": members.profiles,
        "nom": API.users.get({ "user_ids": "${senderId + ',' + opponentId}" }),
        "acc": API.users.get({ "user_ids": "${senderId + ',' + opponentId}", "name_case": "acc" })
      };
    `
  })).response

  if (!chatUsers.profiles.some(e => e.id === opponentId)) return update.reply('🤷‍♂️ Я не вижу этого [id' + opponentId + '|человека] в беседе')
  if (opponentId < 0) return update.reply('👿 Нельзя драться с ботом!')
  if (opponentId === ID * 1) return update.reply('🤗 Не буду)')

  const player = new Opponent(senderId)
  const opponent = new Opponent(opponentId)

  const { state, amount } = player.isEnoughFor(BATTLE_PRICE)
  if (!state)
    return update.reply(
      `🧮 Не хватает денег: у тебя ${amount}T, а нужно ${BATTLE_PRICE}T`
    )

  player.subtract(BATTLE_PRICE)

  timeouts.set('battle', {
    timestamp: Date.now(),
    timeout: BATTLE_COOLDOWN,
  })

  const pProfile = { nom: chatUsers.nom[0], acc: chatUsers.acc[0] }
  const oProfile = { nom: chatUsers.nom[1], acc: chatUsers.acc[1] }
  const names = {
    player: {
      nom: pProfile.nom.first_name + ' ' + pProfile.nom.last_name,
      acc: pProfile.acc.first_name + ' ' + pProfile.acc.last_name,
      short: '' +
        pProfile.nom.first_name.substring(0, 1) +
        pProfile.nom.last_name.substring(0, 1),
    },
    opponent: {
      nom: oProfile.nom.first_name + ' ' + oProfile.nom.last_name,
      acc: oProfile.acc.first_name + ' ' + oProfile.acc.last_name,
      short: '' +
        oProfile.nom.first_name.substring(0, 1) +
        oProfile.nom.last_name.substring(0, 1),
    },
  }

  player.name = names.player
  opponent.name = names.opponent

  let history = [player.name.nom + ' ⚔️ ' + opponent.name.nom, '']

  function getCategory(i: number) {
    switch (i) {
    case 0:
      return 'beginning'
    case 1:
      return 'middle'
    default:
      return 'filling'
    }
  }

  function getHistory(attacker: Opponent, c: IHistoryCategories) {
    const text = randomArray(histories[c])

    return text
      .replace(/%PLAYER%/g, attacker.name.nom)
      .replace(/%PLAYER_ACC%/g, attacker.name.acc)
  }

  function getStats() {
    return `🛡️ ${player.name.short} - ${player.hp}HP | ${opponent.name.short} - ${opponent.hp}HP`
  }

  function end(state) {
    const level = getHistory(state.winner, 'ending')

    history.push('🔻 ' + level)
    history.push(
      `\n🎉 Победитель - ${state.winner.name.nom} | ${state.winner.hp}HP\n🔹 Проигравший - ${state.loser.name.nom} | 0HP`
    )

    // Add 35 reputation to the executor of the command (because the opponent cannot cancel the battle) if it is a winner
    // If it is not, then add 50 to the opponent
    if (state.winner.id === player.id) state.winner.addReputation(35)
    else state.winner.addReputation(50)

    // Add 2000 credits to the winner
    state.winner.add(2000)

    return update.send(history.join('\n'))
  }

  function next(i: number) {
    if (!player.isDead() && !opponent.isDead()) {
      const damage = random(30, 50),
        attacker = Math.random() >= 0.5 ? player : opponent,
        receiver = attacker.id === player.id ? opponent : player,
        c = Math.random()

      if (c < 0.1) {
        history.push(receiver.name.nom + ' отклоняет удар!\n')

        return next(i)
      }

      const hpState = receiver.decreaseHP(damage)

      if (!hpState) {
        return end({ winner: attacker, loser: receiver })
      } else {
        const category = getCategory(i)
        const level = getHistory(attacker, category)

        history.push('• ' + level)
        history.push(getStats())
        history.push('')

        return next(i + 1)
      }
    }
  }

  const chance = Math.random()
  if (chance < 0.01) {
    const winner = Math.random() >= 0.5 ? player : opponent,
      loser = winner.id === player.id ? opponent : player

    history.push('🔘 ПОЛНАЯ АННИГИЛЯЦИЯ ПРОТИВНИКА с шансом ' + Math.floor(chance * 1000) / 10 + '%\n')

    return end({ winner, loser })
  }

  next(0)
}

exports.command = {
  arguments: '(id)|(id)',
  description: {
    en: 'Battle someone!',
    ru: 'Устрой сельскую драку!',
  },
  alias: ['битва', 'батл', 'драка', 'подраться', 'подратся'],
}
