'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// @ts-check

// padStart pollyfill from MDN
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
    // eslint-disable-line no-extend-native
    targetLength = targetLength >> 0; // floor if number or convert non-number to 0;
    padString = String(padString || ' ');
    if (this.length > targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); // append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}

/**
 * Simple type checking class.
 *
 * @class Is
 */

var Is = function () {
  function Is() {
    _classCallCheck(this, Is);
  }

  _createClass(Is, [{
    key: 'string',

    /**
     * Returns true if value is a string.
     *
     * @param {any} value
     * @returns {boolean}
     * @memberof Is
     */
    value: function string(value) {
      return Object.prototype.toString.call(value) === '[object String]';
    }

    /**
     * Returns true if value is a number.
     *
     * @param {any} value
     * @returns {boolean}
     * @memberof Is
     */

  }, {
    key: 'number',
    value: function number(value) {
      return Object.prototype.toString.call(value) === '[object Number]';
    }

    /**
     * Returns true if value is not a number.
     *
     * @param {any} value
     * @returns {boolean}
     * @memberof Is
     */

  }, {
    key: 'nan',
    value: function nan(value) {
      return Number.isNaN(value);
    }

    /**
     * Returns true if value is an integer.
     *
     * @param {any} value
     * @returns {boolean}
     * @memberof Is
     */

  }, {
    key: 'integer',
    value: function integer(value) {
      return this.number(value) && !this.nan(value) && value % 1 === 0;
    }

    /**
     * Returns true if value only contains alphnumeric characters.
     *
     * @param {any} value
     * @returns {boolean}
     * @memberof Is
     */

  }, {
    key: 'alphaNum',
    value: function alphaNum(value) {
      return value.match(/[^0-9a-z]/i) === null;
    }

    /**
     * returns true if value is an empty string.
     *
     * @param {any} value
     * @returns {boolean}
     * @memberof Is
     */

  }, {
    key: 'emptyString',
    value: function emptyString(value) {
      return this.string(value) && value === '';
    }
  }]);

  return Is;
}();

/**
 * Materialized Path Pattern Generator Error
 *
 * @class MppgError
 * @extends {Error}
 */


var MppgError = function (_Error) {
  _inherits(MppgError, _Error);

  /**
   * Creates an instance of MppgError.
   * @param {any} params
   * @memberof MppgError
   */
  function MppgError() {
    var _ref;

    _classCallCheck(this, MppgError);

    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = MppgError.__proto__ || Object.getPrototypeOf(MppgError)).call.apply(_ref, [this].concat(params)));

    Error.captureStackTrace(_this, MppgError);
    _this.date = new Date();
    return _this;
  }

  /**
   * Helper function to throw the MppgError exception.
   *
   * @static
   * @param {any} params
   * @memberof MppgError
   */


  _createClass(MppgError, null, [{
    key: 'throw',
    value: function _throw() {
      for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        params[_key2] = arguments[_key2];
      }

      throw new (Function.prototype.bind.apply(MppgError, [null].concat(params)))();
    }

    /**
     * Returns a frozen object with the MppgError messages as properties.
     *
     * @readonly
     * @static
     * @memberof MppgError
     */

  }, {
    key: 'messages',
    get: function get() {
      return Object.freeze({
        invalidIdLength: 'The idLength options must be a positive integer.',
        invalidChr: 'Invalid characters in the path or id string. Only 0-9 and A-Z allowed.',
        invalidPathLength: 'Path length not related to id length.',
        intNan: 'Path id is not a number (NaN).',
        intMax: 'Path id value is greater than the maximum permitted with the current idLength.',
        pathIdMin: 'Path id value is zero which is below the starting value of one.',
        noParent: 'Path id does not have a parent.'
      });
    }
  }]);

  return MppgError;
}(Error);

/**
 * Materialized Path Pattern Generator
 *
 * @class MPPG
 */


var MPPG = function () {
  /**
   * Creates an instance of MPPG.
   * @param {number} idLength
   * @throws {MppgError} The idLength options must be a positive integer.
   * @memberof MPPG
   */
  function MPPG(_ref2) {
    var idLength = _ref2.idLength;

    _classCallCheck(this, MPPG);

    this.is = new Is();
    this.MppgError = MppgError;
    this.is.integer(idLength) && idLength < 2 && this.MppgError.throw(MppgError.messages.invalidIdLength);
    this.idLength = idLength;
    this.minChr = '0';
    this.maxChr = 'Z';
    this.errId = this.minChr.padStart(this.idLength, this.minChr);
    this.minId = '1'.padStart(this.idLength, this.minChr);
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


  _createClass(MPPG, [{
    key: 'cleanStr',
    value: function cleanStr(strValue) {
      strValue = strValue || '';
      strValue = this.is.string(strValue) ? strValue : strValue.toString();
      this.is.alphaNum(strValue) || MppgError.throw(MppgError.messages.invalidChr);
      return strValue.toUpperCase();
    }

    /**
     * If intValue is not an int it is converted to an int.
     * Checks for NaN values.
     * Gets the absolute value of the intValue.
     * Checks the intValue is below the maximum allowable value.
     *
     * @param {number} intValue
     * @returns {number}
     * @throws {MppgError} Path id is not a number (NaN).
     * @throws {MppgError} Path id value is greater than the maximum permitted with the current idLength.
     * @memberof MPPG
     */

  }, {
    key: 'cleanInt',
    value: function cleanInt(intValue) {
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

  }, {
    key: 'testPathLength',
    value: function testPathLength(mpath) {
      mpath = mpath || '';
      var valid = true;
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

  }, {
    key: 'testPathHasParent',
    value: function testPathHasParent(mpath) {
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

  }, {
    key: 'toBase36',
    value: function toBase36(intValue) {
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

  }, {
    key: 'fromBase36',
    value: function fromBase36(strValue) {
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

  }, {
    key: 'getPathLength',
    value: function getPathLength(mpath) {
      mpath = this.cleanStr(mpath);
      this.testPathLength(mpath);
      return mpath.length === 0 ? 0 : mpath.length / this.idLength;
    }

    /**
     * Returns the lowest id value.
     *
     * @returns {string}
     * @memberof MPPG
     */

  }, {
    key: 'getRootId',
    value: function getRootId() {
      return this.minId;
    }

    /**
     * Given one path id it will return the next path id in sequence.
     *
     * @param {string} pathId
     * @returns {string}
     * @memberof MPPG
     */

  }, {
    key: 'getNextId',
    value: function getNextId(pathId) {
      pathId = this.cleanStr(pathId);
      this.is.emptyString(pathId) || this.testPathLength(pathId);
      pathId = pathId ? this.fromBase36(pathId) : 0;
      pathId = this.toBase36(++pathId);
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

  }, {
    key: 'getPreviousId',
    value: function getPreviousId(pathId) {
      pathId = this.cleanStr(pathId);
      this.testPathLength(pathId);
      pathId = this.fromBase36(pathId);
      pathId = this.toBase36(--pathId);
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

  }, {
    key: 'getParentId',
    value: function getParentId(mpath) {
      mpath = this.cleanStr(mpath);
      this.testPathLength(mpath);
      var twoId = this.idLength * 2;
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

  }, {
    key: 'getChildId',
    value: function getChildId(mpath) {
      mpath = this.cleanStr(mpath);
      this.testPathLength(mpath);
      mpath = mpath.length < this.idLength ? this.minId : mpath;
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

  }, {
    key: 'getParentPath',
    value: function getParentPath(mpath) {
      mpath = this.cleanStr(mpath);
      this.testPathLength(mpath);
      mpath.length < 2 * this.idLength && MppgError.throw(MppgError.messages.noParent);
      return mpath.slice(0, -this.idLength);
    }

    /**
     * Returns the next sibling path based on the provided path.
     *
     * @param {string} mpath
     * @returns {string}
     * @memberof MPPG
     */

  }, {
    key: 'getNextSibligPath',
    value: function getNextSibligPath(mpath) {
      mpath = this.cleanStr(mpath);
      this.testPathLength(mpath);
      if (mpath.length === this.idLength) {
        return this.getNextId(mpath);
      }
    }

    /**
     * Returns the next child path by appending the first path id onto the provided path.
     *
     * @param {string} mpath
     * @returns {string}
     * @memberof MPPG
     */

  }, {
    key: 'getNextChildPath',
    value: function getNextChildPath(mpath) {
      mpath = this.cleanStr(mpath);
      this.is.emptyString(mpath) || this.testPathLength(mpath);
      return mpath + this.minId;
    }
  }]);

  return MPPG;
}();

module.exports = MPPG;
