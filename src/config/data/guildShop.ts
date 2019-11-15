import GuildItem from '../../models/GuildItem'

const items = [
  new GuildItem({
    id: 1,
    icon: '👨',
    name: 'Горожанин',
    price: 10000,
    group: 'peasants',
    multName: 'Горожане',
    accName: 'Горожанинов',
    rep: 5,
    boost: 1,
  }),
  new GuildItem({
    id: 2,
    icon: '👨‍🌾',
    name: 'Фермер',
    price: 15000,
    group: 'farmers',
    multName: 'Фермеры',
    accName: 'Фермеров',
    rep: 10,
    boost: 2,
  }),
  new GuildItem({
    id: 3,
    icon: '🗡️',
    name: 'Богатырь',
    price: 50000,
    group: 'warriors',
    multName: 'Богатыри',
    accName: 'Богатырей',
    rep: 25,
    boost: 5,
  }),
  new GuildItem({
    id: 4,
    icon: '🛡️',
    name: 'Щит',
    price: 50000,
    group: 'shield',
    rep: 0,
    boost: 0,
  }),
]

module.exports = items
