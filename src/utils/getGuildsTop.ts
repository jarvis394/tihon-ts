import db from '../globals/database'

export default () =>
  db
    .prepare('SELECT * FROM main.guilds ORDER BY reputation DESC LIMIT 100;')
    .all()
