/* eslint-disable no-undef */
import { Update } from '../../mocks'
import '../../../src/startup/aliases'

// beforeAll(() => { require('../../../src/startup/aliases') })

test('should execute without errors', async () => {
  expect(
    await require('../../../src/commands/utils/ping').run.bind(null, {
      update: Update,
      args: null,
    })
  ).not.toThrow()
})
