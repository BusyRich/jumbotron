var crypto = require('crypto');

// add jumbotron utilities to Node's, for convenience
module.exports = util = require('util');

// regex that matches anything that is not alphanumeric or a space
util.alphaNumeric = /[^0-9A-Za-z\s]/g;

// simple deep extend with array concatenation
util.extend = function(target, ext) {
  var clone = util._extend({}, target);

  Object.keys(ext).forEach(function(key) {
    var value = ext[key];

    if(value instanceof Array && clone[key] instanceof Array) {
      clone[key] = clone[key].concat(value);
    } else if(typeof value === 'object' && typeof clone[key] === 'object') {
      clone[key] = util.extend(clone[key], value);
    } else {
      clone[key] = value;
    }
  });

  return clone;
};

// converts a string to be URL-friendly
util.toURL = function(str) {
  util.alphaNumeric.lastIndex = 0;

  return str
    .replace(util.alphaNumeric, '')
    .toLowerCase()
    .replace(' ', '-');
};

// camel cases a string
util.toCamelCase = function(str) {
  util.alphaNumeric.lastIndex = 0;

  return str
    .replace(util.alphaNumeric, '')
    .toLowerCase()
    .replace(/(\ [a-z])/g, function(match) {
      return match.toUpperCase().replace(' ','');
    });
};

util.createHash = function(secret) {
  var cipher = crypto.createCipher('blowfish', secret);
  return(cipher.final('hex'));
};

util.createToken = function() {
  var ts = new Date().getTime(),
      rand = Math.floor(Math.random() * 9999999),
      secret = ts.toString() + rand.toString();

  return {secret: util.createHash(secret), socketId: secret};
};

util.getLogo = function() {
  return '.---..-----------------------------------------------------------..---.\n' +
  '|   ||.---------------------------------------------------------.||   |\n' +
  '| o |||                                                         ||| o |\n' +
  '| _ |||                                                         ||| _ |\n' +
  '|(_)|||        _ _   _ __  __ ___  ___ _____ ___  ___  _  _     |||(_)|\n' +
  '|   |||     _ | | | | |  \\/  | _ )/ _ |_   _| _ \\/ _ \\| \\| |    |||   |\n' +
  '|.-.|||    | || | |_| | |\\/| | _ | (_) || | |   | (_) | .` |    |||.-.|\n' +
  '| o |||     \\__/ \\___/|_|  |_|___/\\___/ |_| |_|_\\\\___/|_|\\_|    ||| o |\n' +
  '|`-\'|||                                                         |||`-\'|\n' +
  '|   |||                                                         |||   |\n' +
  '|.-.|||                                                         |||.-.|\n' +
  '| O |||                                                         ||| O |\n' +
  '|`-\'||`---------------------------------------------------------\'||`-\'|\n' +
  '`---\'`-----------------------------------------------------------\'`---\'';
};
