/* eslint-disable no-undef */
import { Update } from '../../mocks'

test('should execute without errors', async () => {
  expect(
    await require('../../../src/commands/utils/ping').run.bind(null, {
      update: Update,
      args: null,
    })
  ).not.toThrow()
})
