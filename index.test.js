const MPPG = require('./index')
const mppg = new MPPG({padLength: 5})
const testString = 'ZZZZZ'
const testInt = 60466175
const firstId = '00001'

test('fromBase36', () => {
  expect(mppg.fromBase36(testString)).toBe(testInt)
})

test('toBase36', () => {
  expect(mppg.toBase36(testInt)).toBe(testString)
})

test('getNextId', () => {
  const nextId = mppg.getNextId(testString)
  expect(nextId).toBe('100000')
  expect(mppg.getNextId()).toBe(firstId)
})

test('getPreviousId', () => {
  const nextId = mppg.getPreviousId(testString)
  expect(nextId).toBe('ZZZZY')
})
