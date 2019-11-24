import db from '@globals/database'

export default () =>
  db
    .prepare(
      "SELECT * FROM main.users WHERE id > 0 AND hidden IS NOT 'true' ORDER BY reputation DESC LIMIT 100;"
    )
    .all()
