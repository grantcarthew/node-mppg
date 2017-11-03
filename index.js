class Is {
  string (value) {
    return Object.prototype.toString.call(value) === '[object String]'
  }

  number (value) {
    return Object.prototype.toString.call(value) === '[object Number]'
  }

  nan (value) {
    return Number.isNaN(value)
  }

  integer (value) {
    return this.number(value) && !this.nan(value) && value % 1 === 0
  }

  alphaNum (value) {
    return value.match(/[^0-9a-z]/i) === null
  }
}

class MppgError extends Error {
  constructor (...params) {
    super(...params)
    Error.captureStackTrace(this, MppgError)
    this.date = new Date()
  }
  static throw (...params) {
    throw new MppgError(...params)
  }
  static get messages () {
    return Object.freeze({
      invalidChr: 'Invalid characters in the path or id string. Only 0-9 and A-Z allowed.',
      invalidPathLength: 'Path length not related to pad length.',
      intNan: 'Path id is not a number (NaN).',
      intMax: 'Path id value is greater than the maximum permitted with the current padLength.',
      pathIdMin: 'Path id value is zero which is below the starting value of one.',
      noParent: 'Path id does not have a parent.'

    })
  }
}

class MPPG {
  constructor (options) {
    this.padLength = options.padLength
    this.minChr = '0'
    this.maxChr = 'Z'
    this.is = new Is()
    this.errId = this.minChr.padStart(this.padLength, this.minChr)
    this.minId = '1'.padStart(this.padLength, this.minChr)
    this.maxId = this.maxChr.padStart(this.padLength, this.maxChr)
    this.maxInt = this.fromBase36(this.maxId)
    this.MppgError = MppgError
  }

  cleanStr (strValue, checkLength = true) {
    strValue = strValue || ''
    strValue = this.is.string(strValue) ? strValue : strValue.toString()
    this.is.alphaNum(strValue) || MppgError.throw(MppgError.messages.invalidChr, strValue)
    checkLength &&
      strValue.length % this.padLength !== 0 &&
      MppgError.throw(MppgError.messages.invalidPathLength)
    return strValue.toUpperCase()
  }

  cleanInt (intValue) {
    intValue = this.is.integer(intValue) ? intValue : parseInt(intValue)
    this.is.nan(intValue) && MppgError.throw(MppgError.messages.intNan)
    intValue = Math.abs(intValue)
    intValue > this.maxInt && MppgError.throw(MppgError.messages.intMax)
    return intValue
  }

  toBase36 (intValue) {
    intValue = this.cleanInt(intValue)
    return intValue.toString(36).toUpperCase()
  }

  fromBase36 (strValue) {
    strValue = this.cleanStr(strValue, false)
    return parseInt(strValue, 36)
  }

  getPathLength (path) {
    this.cleanStr(path)
    return path.length === 0 ? 0 : path.length / this.padLength
  }

  testPathHasParent (mpath) {
    mpath = this.cleanStr(mpath)
    return mpath.length >= (2 * this.padLength)
  }

  getNextId (pathId) {
    pathId = pathId ? this.fromBase36(pathId) : 0
    pathId = this.toBase36(++pathId)
    pathId = pathId.padStart(this.padLength, this.minChr)
    return pathId
  }

  getPreviousId (pathId) {
    pathId = this.fromBase36(pathId)
    pathId = this.toBase36(--pathId)
    pathId = pathId.padStart(this.padLength, this.minChr)
    pathId === this.errId && MppgError.throw(MppgError.messages.pathIdMin)
    return pathId
  }

  getParentId (mpath) {
    mpath = this.cleanStr(mpath)
    let twoPad = this.padLength * 2
    mpath.length < twoPad && MppgError.throw(MppgError.messages.noParent)
    return mpath.slice(-twoPad, -this.padLength)
  }

  getChildId (mpath) {
    mpath = this.cleanStr(mpath)
    mpath = mpath.length < this.padLength ? this.minId : mpath
    if (mpath.length === this.padLength) { return mpath }
    return mpath.slice(-this.padLength)
  }

  getNextChildPath (mpath) {
    mpath = this.cleanStr(mpath)
    return mpath + this.minId
  }

  getNextSibligPath (mpath) {
    mpath = this.cleanStr(mpath)
    if (mpath.length === this.padLength) { return }
  }
}

module.exports = MPPG
