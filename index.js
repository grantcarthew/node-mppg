class MPPG {
  constructor (options) {
    this.padLength = options.padLength
    this.padChr = '0'
  }

  toBase36 (value) {
    return value.toString(36).toUpperCase()
  }

  fromBase36 (value) {
    return parseInt(value.toUpperCase(), 36)
  }

  getNextId (value) {
    let valueAsInt = value ? this.fromBase36(value) : 0
    let newId = this.toBase36(++valueAsInt)
    return newId.padStart(this.padLength, this.padChr)
  }

  getPreviousId (value) {
    let valueAsInt = this.fromBase36(value)
    return this.toBase36(--valueAsInt)
  }

  getNextChildPath (path) {
    let childPath = path

  }
  decode () {

  }
}

module.exports = MPPG
