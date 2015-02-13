'use strict';
module.exports = function (ArrayLike) {

  ArrayLike = ArrayLike || Array;

  // there's 3 implementations written in increasing order of efficiency

  // 1 - no Set type is defined
  function uniqNoSet(arr) {
    var ret = new ArrayLike();

    for (var i = 0; i < arr.length; i++) {
      if (ret.indexOf(arr[i]) === -1) {
        ret.push(arr[i]);
      }
    }

    return ret;
  }

  // 2 - a simple Set type is defined
  function uniqSet(arr) {
    var seen = new Set();
    return arr.filter(function (el) {
      if (!seen.has(el)) {
        seen.add(el);
        return true;
      }
    });
  }

  // 3 - a standard Set type is defined and it has a forEach method
  function uniqSetWithForEach(arr) {
    var ret = new ArrayLike();

    (new Set(arr)).forEach(function (el) {
      ret.push(el);
    });

    return ret;
  }

  // V8 currently has a broken implementation
  // https://github.com/joyent/node/issues/8449
  function doesForEachActuallyWork() {
    var ret = false;

    (new Set([true])).forEach(function (el) {
      ret = el;
    });

    return ret;
  }

  if ('Set' in global) {
    if (typeof Set.prototype.forEach === 'function' && doesForEachActuallyWork()) {
      return uniqSetWithForEach;
    }
    return uniqSet;
  }
  return uniqNoSet;

};
