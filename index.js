// @ts-check

/**
 * Simple type checking class.
 *
 * @class Is
 */
class Is {
  /**
   * Returns true if value is a string.
   *
   * @param {any} value
   * @returns {boolean}
   * @memberof Is
   */
  string(value) {
    return Object.prototype.toString.call(value) === "[object String]";
  }

  /**
   * Returns true if value is a number.
   *
   * @param {any} value
   * @returns {boolean}
   * @memberof Is
   */
  number(value) {
    return Object.prototype.toString.call(value) === "[object Number]";
  }

  /**
   * Returns true if value is not a number.
   *
   * @param {any} value
   * @returns {boolean}
   * @memberof Is
   */
  nan(value) {
    return Number.isNaN(value);
  }

  /**
   * Returns true if value is an integer.
   *
   * @param {any} value
   * @returns {boolean}
   * @memberof Is
   */
  integer(value) {
    return this.number(value) && !this.nan(value) && value % 1 === 0;
  }

  /**
   * Returns true if value only contains alphnumeric characters.
   *
   * @param {any} value
   * @returns {boolean}
   * @memberof Is
   */
  alphaNum(value) {
    return value.match(/[^0-9a-z]/i) === null;
  }

  /**
   * returns true if value is an empty string.
   *
   * @param {any} value
   * @returns {boolean}
   * @memberof Is
   */
  emptyString(value) {
    return this.string(value) && value === "";
  }
}

/**
 * Materialized Path Pattern Generator Error
 *
 * @class MppgError
 * @extends {Error}
 */
class MppgError extends Error {
  /**
   * Creates an instance of MppgError.
   * @param {any} params
   * @memberof MppgError
   */
  constructor(...params) {
    super(...params);
    Error.captureStackTrace(this, MppgError);
    this.date = new Date();
  }

  /**
   * Helper function to throw the MppgError exception.
   *
   * @static
   * @param {any} params
   * @memberof MppgError
   */
  static throw(...params) {
    throw new MppgError(...params);
  }

  /**
   * Returns a frozen object with the MppgError messages as properties.
   *
   * @readonly
   * @static
   * @memberof MppgError
   */
  static get messages() {
    return Object.freeze({
      invalidIdLength:
        "The idLength option must be two or more positive integers.",
      invalidChr:
        "Invalid characters in the path or id string. Only 0-9 and A-Z allowed.",
      invalidPathLength: "Path length not related to id length.",
      intNan: "Path id is not a number (NaN).",
      intMax:
        "Path id value is greater than the maximum permitted with the current idLength.",
      pathIdMin:
        "Path id value is zero which is below the starting value of one.",
      noParent: "Path id does not have a parent.",
    });
  }
}

/**
 * Materialized Path Pattern Generator
 *
 * @class MPPG
 */
class MPPG {
  /**
   * Creates an instance of MPPG.
   * @typedef IdLength
   * @type {object}
   * @property {number} idLength
   *
   * @param {IdLength} idLengthObj
   * @throws {MppgError} The idLength options must be a positive integer.
   * @memberof MPPG
   */
  constructor({ idLength }) {
    this.is = new Is();
    this.MppgError = MppgError;
    this.is.integer(idLength) &&
      idLength < 2 &&
      this.MppgError.throw(MppgError.messages.invalidIdLength);
    this.idLength = idLength;
    this.minChr = "0";
    this.maxChr = "Z";
    this.errId = this.minChr.padStart(this.idLength, this.minChr);
    this.minId = "1".padStart(this.idLength, this.minChr);
    this.maxId = this.maxChr.padStart(this.idLength, this.maxChr);
    this.maxInt = this.fromBase36(this.maxId);
  }

  /**
   * Replaces null values with empty string.
   * Checks for valid string.
   * Checks for only alphanumeric characters.
   * Converts to upper case.
   *
   * @param {string} strValue
   * @returns {string}
   * @throws {MppgError} Invalid characters in the path or id string. Only 0-9 and A-Z allowed.
   * @memberof MPPG
   */
  cleanStr(strValue) {
    strValue = strValue || "";
    strValue = this.is.string(strValue) ? strValue : strValue.toString();
    this.is.alphaNum(strValue) ||
      MppgError.throw(MppgError.messages.invalidChr);
    return strValue.toUpperCase();
  }

  /**
   * If intValue is not an int it is converted to an int.
   * Checks for NaN values.
   * Gets the absolute value of the intValue.
   * Checks the intValue is below the maximum allowable value.
   *
   * @param {any} intValue
   * @returns {number}
   * @throws {MppgError} Path id is not a number (NaN).
   * @throws {MppgError} Path id value is greater than the maximum permitted with the current idLength.
   * @memberof MPPG
   */
  cleanInt(intValue) {
    intValue = this.is.integer(intValue) ? intValue : parseInt(intValue, 10);
    this.is.nan(intValue) && MppgError.throw(MppgError.messages.intNan);
    intValue = Math.abs(intValue);
    intValue > this.maxInt && MppgError.throw(MppgError.messages.intMax);
    return intValue;
  }

  /**
   * Throws an exception if the path length is not valid.
   * Valid path lengths are one or more multiples of idLength.
   *
   * @param {string} mpath
   * @throws {MppgError} Path length not related to id length.
   * @memberof MPPG
   */
  testPathLength(mpath) {
    mpath = mpath || "";
    let valid = true;
    mpath.length < this.idLength && (valid = false);
    mpath.length % this.idLength !== 0 && (valid = false);
    valid || MppgError.throw(MppgError.messages.invalidPathLength);
  }

  /**
   * Returns true if the mpath length is two or more times the length of idLength.
   *
   * @param {string} mpath
   * @returns {boolean}
   * @memberof MPPG
   */
  testPathHasParent(mpath) {
    mpath = this.cleanStr(mpath);
    this.testPathLength(mpath);
    return mpath.length >= 2 * this.idLength;
  }

  /**
   * Converts the int value into a base36 string.
   *
   * @param {number} intValue
   * @returns {string}
   * @memberof MPPG
   */
  toBase36(intValue) {
    intValue = this.cleanInt(intValue);
    return intValue.toString(36).toUpperCase();
  }

  /**
   * Converts a base36 string into a number.
   *
   * @param {string} strValue
   * @returns {number}
   * @memberof MPPG
   */
  fromBase36(strValue) {
    strValue = this.cleanStr(strValue);
    return parseInt(strValue, 36);
  }

  /**
   * Returns a number based on the multiples of idLength.
   * If the idLength is 3 and the mpath is 9 then this function will return 3.
   *
   * @param {string} mpath
   * @returns {number}
   * @memberof MPPG
   */
  getPathLength(mpath) {
    mpath = this.cleanStr(mpath);
    this.testPathLength(mpath);
    return mpath.length / this.idLength;
  }

  /**
   * Returns the lowest id value.
   *
   * @returns {string}
   * @memberof MPPG
   */
  getRootId() {
    return this.minId;
  }

  /**
   * Given one path id it will return the next path id in sequence.
   *
   * @param {string} pathId
   * @returns {string}
   * @memberof MPPG
   */
  getNextId(pathId) {
    pathId = this.cleanStr(pathId);
    this.is.emptyString(pathId) || this.testPathLength(pathId);
    let pathIdNumber = pathId ? this.fromBase36(pathId) : 0;
    pathId = this.toBase36(++pathIdNumber);
    pathId = pathId.padStart(this.idLength, this.minChr);
    return pathId;
  }

  /**
   * Given one path id it will return the previous id value.
   *
   * @param {string} pathId
   * @returns {string}
   * @throws {MppgError} Path id value is zero which is below the starting value of one.
   * @memberof MPPG
   */
  getPreviousId(pathId) {
    pathId = this.cleanStr(pathId);
    this.testPathLength(pathId);
    let pathIdNumber = this.fromBase36(pathId);
    pathId = this.toBase36(--pathIdNumber);
    pathId = pathId.padStart(this.idLength, this.minChr);
    pathId === this.errId && MppgError.throw(MppgError.messages.pathIdMin);
    return pathId;
  }

  /**
   * Returns the parent path from a given child path.
   *
   * @param {string} mpath
   * @returns {string}
   * @throws {MppgError} Path id does not have a parent.
   * @memberof MPPG
   */
  getParentId(mpath) {
    mpath = this.cleanStr(mpath);
    this.testPathLength(mpath);
    let twoId = this.idLength * 2;
    mpath.length < twoId && MppgError.throw(MppgError.messages.noParent);
    return mpath.slice(-twoId, -this.idLength);
  }

  /**
   * Appends a new child id to the given parent path.
   *
   * @param {string} mpath
   * @returns {string}
   * @memberof MPPG
   */
  getChildId(mpath) {
    mpath = this.cleanStr(mpath);
    this.testPathLength(mpath);
    if (mpath.length === this.idLength) {
      return mpath;
    }
    return mpath.slice(-this.idLength);
  }

  /**
   * Returns the parent path from the given path.
   *
   * @param {string} mpath
   * @returns {string}
   * @throws {MppgError} Path id does not have a parent.
   * @memberof MPPG
   */
  getParentPath(mpath) {
    mpath = this.cleanStr(mpath);
    this.testPathLength(mpath);
    mpath.length < 2 * this.idLength &&
      MppgError.throw(MppgError.messages.noParent);
    return mpath.slice(0, -this.idLength);
  }

  /**
   * Returns the next sibling path based on the provided path.
   *
   * @param {string} mpath
   * @returns {string}
   * @memberof MPPG
   */
  getNextSiblingPath(mpath) {
    mpath = this.cleanStr(mpath);
    this.testPathLength(mpath);
    if (mpath.length === this.idLength) {
      return this.getNextId(mpath);
    }
    return (
      mpath.slice(0, -this.idLength) +
      this.getNextId(mpath.slice(mpath.length - this.idLength))
    );
  }

  /**
   * Returns the next child path by appending the first path id onto the provided path.
   *
   * @param {string} mpath
   * @returns {string}
   * @memberof MPPG
   */
  getNextChildPath(mpath) {
    mpath = this.cleanStr(mpath);
    this.is.emptyString(mpath) || this.testPathLength(mpath);
    return mpath + this.minId;
  }
}

module.exports = MPPG;
