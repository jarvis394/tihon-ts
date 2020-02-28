/* eslint-disable no-undef */
import { Update } from '../../mocks'

beforeAll(() => { require('../../../src/startup/aliases') })

const n1 = 5,
  n2 = 100

const gen = ({ update = Update, args = [] }) =>
  require('../../../src/commands/utils/roll').run.bind(null, {
    update,
    args,
  })

test('should execute without errors', async () => {
  expect(await gen({})).not.toThrow()
})

test('should process a range with one argument', async () => {
  const g = await gen({ args: [n2] })()

  expect(g).toBeGreaterThanOrEqual(0)
  expect(g).toBeLessThanOrEqual(n2)
})

test('should process a range with two arguments', async () => {
  const g = await gen({ args: [n1, n2] })()

  expect(g).toBeGreaterThanOrEqual(n1)
  expect(g).toBeLessThanOrEqual(n2)
})

test('should process a range with two arguments', async () => {
  const g = await gen({ args: ['qwerty', 'qwerty'] })

  expect(g).not.toThrow()
})
