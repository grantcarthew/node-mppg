const MPPG = require('./index')
const mppg = new MPPG({idLength: 5})
const mgs = mppg.MppgError.messages
const lastId = 'ZZZZZ'
const midId = 'X23GP'
const midp1Id = 'X23GQ'
const midm1Id = 'X23GO'
const firstId = '00001'
const maxInt = 60466175

test('constructor', () => {
  /* eslint-disable no-new */
  expect(() => { new MPPG({idLength: 0}) }).toThrow(mgs.invalidIdLength)
  expect(() => { new MPPG({idLength: 1}) }).toThrow(mgs.invalidIdLength)
  /* eslint-enable no-new */
  expect(new MPPG({idLength: 2})).toBeInstanceOf(MPPG)
  expect(new MPPG({idLength: 3})).toBeInstanceOf(MPPG)
  expect(new MPPG({idLength: 4})).toBeInstanceOf(MPPG)
})

test('cleanStr', () => {
  expect(() => { mppg.cleanStr('abc#123') }).toThrow(mgs.invalidChr)
  expect(mppg.cleanStr()).toBe('')
  expect(mppg.cleanStr(12345)).toBe('12345')
  expect(mppg.cleanStr('abc12')).toBe('ABC12')
  expect(mppg.cleanStr('abc123')).toBe('ABC123')
})

test('cleanInt', () => {
  // expect(mppg.cleanInt()).toBe(1)
  expect(mppg.cleanInt(55)).toBe(55)
  expect(mppg.cleanInt(0)).toBe(0)
  expect(mppg.cleanInt(-1000)).toBe(1000)
  expect(mppg.cleanInt('123abc')).toBe(123)
  expect(mppg.cleanInt(123.456)).toBe(123)
  expect(() => { mppg.cleanInt('#%4kjd') }).toThrow(mgs.intNan)
})

test('testPathLength', () => {
  expect(() => { mppg.testPathLength() }).toThrow(mgs.invalidPathLength)
  expect(() => { mppg.testPathLength('abc') }).toThrow(mgs.invalidPathLength)
  expect(() => { mppg.testPathLength(firstId) }).not.toThrow()
  expect(() => { mppg.testPathLength(firstId + 'abc') }).toThrow(mgs.invalidPathLength)
  expect(() => { mppg.testPathLength(firstId + midId) }).not.toThrow()
  expect(() => { mppg.testPathLength(firstId + midId + lastId) }).not.toThrow()
  expect(() => { mppg.testPathLength(firstId + midId + lastId + 'abc') }).toThrow(mgs.invalidPathLength)
})

test('testPathHasParent', () => {
  expect(() => { mppg.testPathHasParent() }).toThrow(mgs.invalidPathLength)
  expect(mppg.testPathHasParent(firstId)).toBe(false)
  expect(mppg.testPathHasParent(firstId + firstId)).toBe(true)
  expect(mppg.testPathHasParent(firstId + firstId + firstId)).toBe(true)
})

test('fromBase36', () => {
  expect(mppg.fromBase36(lastId)).toBe(maxInt)
  expect(mppg.fromBase36(1)).toBe(1)
})

test('toBase36', () => {
  expect(mppg.toBase36(maxInt)).toBe(lastId)
})

test('getPathLength', () => {
  let pathLength = mppg.getPathLength(firstId + lastId)
  expect(pathLength).toBe(2)
  pathLength = mppg.getPathLength(firstId + midId + lastId)
  expect(pathLength).toBe(3)
  expect(() => { mppg.getPathLength('123') }).toThrow(mgs.invalidPathLength)
  expect(() => { mppg.getPathLength('123ABC') }).toThrow(mgs.invalidPathLength)
})

test('getNextId', () => {
  expect(mppg.getNextId(firstId)).toBe('00002')
  expect(mppg.getNextId(midId)).toBe(midp1Id)
  expect(mppg.getNextId()).toBe(firstId)
  expect(() => { mppg.getNextId(lastId) }).toThrow(mgs.intMax)
})

test('getPreviousId', () => {
  expect(mppg.getPreviousId('00002')).toBe(firstId)
  expect(mppg.getPreviousId(midId)).toBe(midm1Id)
  expect(mppg.getPreviousId(lastId)).toBe('ZZZZY')
  expect(() => { mppg.getPreviousId(firstId) }).toThrow(mgs.pathIdMin)
})

test('getParentId', () => {
  expect(mppg.getParentId(firstId + midId + lastId)).toBe(midId)
  expect(mppg.getParentId(firstId + midId)).toBe(firstId)
  expect(() => { mppg.getParentId(firstId) }).toThrow(mgs.noParent)
  expect(() => { mppg.getParentId() }).toThrow(mgs.invalidPathLength)
})

test('getChildId', () => {
  expect(() => { mppg.getChildId() }).toThrow(mgs.invalidPathLength)
  expect(mppg.getChildId(firstId)).toBe(firstId)
  expect(mppg.getChildId(firstId + midId)).toBe(midId)
  expect(mppg.getChildId(firstId + midId + lastId)).toBe(lastId)
})

test('getParentPath', () => {
  expect(() => { mppg.getParentPath() }).toThrow(mgs.invalidPathLength)
  expect(() => { mppg.getParentPath(firstId) }).toThrow(mgs.noParent)
  expect(mppg.getParentPath(firstId + midId)).toBe(firstId)
  expect(mppg.getParentPath(firstId + midId + lastId)).toBe(firstId + midId)
})

test('getNextSiblingPath', () => {
  expect(() => { mppg.getNextSibligPath() }).toThrow(mgs.invalidPathLength)
  expect(mppg.getNextSibligPath(firstId)).toBe('00002')
})

test('getNextChildPath', () => {
  let nextChildPath = mppg.getNextChildPath()
  expect(nextChildPath).toBe(firstId)
  nextChildPath = mppg.getNextChildPath(midId)
  expect(nextChildPath).toBe(midId + firstId)
  nextChildPath = mppg.getNextChildPath(lastId + midId)
  expect(nextChildPath).toBe(lastId + midId + firstId)
})
