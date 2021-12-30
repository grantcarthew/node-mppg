const tap = require('tap')
const MPPG = require('./index')
const mppg = new MPPG({idLength: 5})
const mgs = mppg.MppgError.messages
const lastId = 'ZZZZZ'
const midRangeId = 'X23GP'
const midRangePlus1Id = 'X23GQ'
const midRangeMinus1Id = 'X23GO'
const firstId = '00001'
const maxInt = 60466175

tap.test('constructor', (t) => {
  t.plan(5)
  let regex = /The idLength option must be two or more/
  t.throws(() => { new MPPG({idLength: 0}) }, regex, 'idLength option set to 0 throws error')
  t.throws(() => { new MPPG({idLength: 1}) }, regex, 'idLength option set to 1 throws error')
  t.ok(new MPPG({idLength: 2}) instanceof MPPG, 'idLength option set to 2 creates MPPG instance')
  t.ok(new MPPG({idLength: 3}) instanceof MPPG, 'idLength option set to 3 creates MPPG instance')
  t.ok(new MPPG({idLength: 4}) instanceof MPPG, 'idLength option set to 4 creates MPPG instance')
})

tap.test('cleanStr', (t) => {
  t.plan(5)
  t.throws(() => { mppg.cleanStr('abc#123') }, null ,mgs.invalidChr)
  t.equal(mppg.cleanStr(), '', 'cleanStr for null returns empty string')
  t.equal(mppg.cleanStr(12345), '12345', 'cleanStr for 12345 returns 12345')
  t.equal(mppg.cleanStr('abc12'), 'ABC12', 'cleanStr for abc12 returns ABC12')
  t.equal(mppg.cleanStr('abc123'), 'ABC123', 'cleanStr for abc123 returns ABC123')
})

tap.test('cleanInt', (t) => {
  t.plan(7)
  t.throws(() => mppg.cleanInt(), /Path id is not a number/, 'Null throws error')
  t.equal(mppg.cleanInt(55), 55, 'cleanInt for 55 returns 55')
  t.equal(mppg.cleanInt(0), 0, 'cleanInt for 0 returns 0')
  t.equal(mppg.cleanInt(-1000), 1000, 'cleanInt for -1000 returns 1000')
  t.equal(mppg.cleanInt('123abc'), 123, 'cleanInt for 123abc returns 123')
  t.equal(mppg.cleanInt(123.456), 123, 'cleanInt for 123.456 returns 123')
  t.throws(() => { mppg.cleanInt('#%4kjd') }, /Path id is not a number/, 'Invalid number throws error')
})

tap.test('testPathLength', (t) => {
  let regex = /Path length not related to id length/
  t.plan(7)
  t.throws(() => { mppg.testPathLength() }, regex, 'Null id throws error')
  t.throws(() => { mppg.testPathLength('abc') }, regex, 'Invalid string id throws error')
  t.doesNotThrow(() => { mppg.testPathLength(firstId) }, 'Valid id does not throw error')
  t.throws(() => { mppg.testPathLength(firstId + 'abc') }, regex, 'Valid id + invalid id throws error')
  t.doesNotThrow(() => { mppg.testPathLength(firstId + midRangeId) }, 'Parent id + child id does not throw error')
  t.doesNotThrow(() => { mppg.testPathLength(firstId + midRangeId + lastId) }, 'Parent id + child id + child id does not throw error')
  t.throws(() => { mppg.testPathLength(firstId + midRangeId + lastId + 'abc') }, 'Parent id + child id + child id + invalid id throws error')
})

tap.test('testPathHasParent', (t) => {
  t.plan(4)
  t.throws(() => { mppg.testPathHasParent() }, /Path length not related to id length/, 'Null id throws error')
  t.equal(mppg.testPathHasParent(firstId), false, 'Id with no parent returns false')
  t.equal(mppg.testPathHasParent(firstId + firstId), true, 'Id with 1 parent returns true')
  t.equal(mppg.testPathHasParent(firstId + firstId + firstId), true, 'Id with 2 parents returns true')
})

tap.test('fromBase36', (t) => {
  t.plan(2)
  t.equal(mppg.fromBase36(lastId), maxInt, 'Largest Base36 id returns max int')
  t.equal(mppg.fromBase36(1), 1, 'Base36 id of 1 returns 1')
})

tap.test('toBase36', (t) => {
  t.plan(1)
  t.equal(mppg.toBase36(maxInt), lastId, 'Max int returns largest Base36 id')
})

tap.test('getPathLength', (t) => {
  let regex = /Path length not related to id length/
  t.plan(4)
  let pathLength = mppg.getPathLength(firstId + lastId)
  t.equal(pathLength, 2, 'Two part path returns 2')
  pathLength = mppg.getPathLength(firstId + midRangeId + lastId)
  t.equal(pathLength, 3, 'Three part path returns 3')
  t.throws(() => { mppg.getPathLength('123') }, regex, 'Small invalid path throws error')
  t.throws(() => { mppg.getPathLength('123ABC') }, regex, 'Large invalid path throws error')
})

tap.test('getRootId', (t) => {
  t.plan(1)
  t.equal(mppg.getRootId(), firstId, 'Returns root id or first id')
})

tap.test('getNextId', (t) => {
  t.plan(4)
  t.equal(mppg.getNextId(firstId), '00002', 'First id returns next id')
  t.equal(mppg.getNextId(midRangeId), midRangePlus1Id, 'Mid-range id returns next child id')
  t.equal(mppg.getNextId(), firstId, 'Null id returns first id')
  t.throws(() => { mppg.getNextId(lastId) }, /Path id value is greater than the maximum/, 'Last id throws error')
})

tap.test('getPreviousId', (t) => {
  t.plan(4)
  t.equal(mppg.getPreviousId('00002'), firstId, 'Second id returnd first id')
  t.equal(mppg.getPreviousId(midRangeId), midRangeMinus1Id, 'Second child id returns first child id')
  t.equal(mppg.getPreviousId(lastId), 'ZZZZY', 'Last id returns second to last id')
  t.throws(() => { mppg.getPreviousId(firstId) }, /Path id value is zero which is below the starting value of one/ , 'First id throws error')
})

tap.test('getParentId', (t) => {
  t.plan(4)
  t.equal(mppg.getParentId(firstId + midRangeId + lastId), midRangeId, 'Three x length id returns two x length')
  t.equal(mppg.getParentId(firstId + midRangeId), firstId, 'Two x length id returns one x length id')
  t.throws(() => { mppg.getParentId(firstId) }, /Path id does not have a parent/, 'Id with no parent throws error')
  t.throws(() => { mppg.getParentId() }, /Path length not related to id length/, 'Null path id throws error')
})

tap.test('getChildId', (t) => {
  t.plan(4)
  t.throws(() => { mppg.getChildId() }, /Path length not related to id length/, 'Null id throws error')
  t.equal(mppg.getChildId(firstId), firstId, 'Parent id returns parent id')
  t.equal(mppg.getChildId(firstId + midRangeId), midRangeId, 'Parent + child id returns child id')
  t.equal(mppg.getChildId(firstId + midRangeId + lastId), lastId, 'Parent + child + child id returns last child id')
})

tap.test('getParentPath', (t) => {
  t.plan(4)
  t.throws(() => { mppg.getParentPath() }, /Path length not related to id length/, 'Null id throws error')
  t.throws(() => { mppg.getParentPath(firstId) }, /Path id does not have a parent/, 'Parent id throws error')
  t.equal(mppg.getParentPath(firstId + midRangeId), firstId, 'Parent and child id returns parent')
  t.equal(mppg.getParentPath(firstId + midRangeId + lastId), firstId + midRangeId, 'Parent with two children returns parent + first child')
})

tap.test('getNextSiblingPath', (t) => {
  t.plan(3)
  t.throws(() => { mppg.getNextSiblingPath() }, /Path length not related to id length/, 'Null id throws error')
  t.equal(mppg.getNextSiblingPath(firstId), '00002', 'First id returns next sibling id')
  t.equal(mppg.getNextSiblingPath(firstId + firstId), '0000100002', 'First id returns next sibling id')
})

tap.test('getNextChildPath', (t) => {
  t.plan(3)
  let nextChildPath = mppg.getNextChildPath()
  t.equal(nextChildPath, firstId, 'Parent id returns first child id')
  nextChildPath = mppg.getNextChildPath(midRangeId)
  t.equal(nextChildPath, midRangeId + firstId, 'Middle range id returns mid-range id + new child id')
  nextChildPath = mppg.getNextChildPath(lastId + midRangeId)
  t.equal(nextChildPath, lastId + midRangeId + firstId, 'Last id + mid-range id returns last id + mid-range id + new child id')
})
