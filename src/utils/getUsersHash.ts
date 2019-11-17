import Hashids from 'hashids'
import { SECRET } from '../config/keys'
const hash = new Hashids(SECRET, 10)

export default (a: number, b: number) => {
  const sortedIds = a < b ? [a, b] : [b, a]
  const res = hash.encode(sortedIds)

  return res
}
