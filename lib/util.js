var fs = require('fs'),
    path = require('path'),
    crypto = require('crypto');

// add jumbotron utilities to Node's, for convenience
module.exports = util = require('util');

// regex that matches anything that is not alphanumeric or a space
util.alphaNumeric = /[^0-9A-Za-z\s]/g;

// simple copy/clone that also clones arrays that are found
util.clone = function(obj) {
  var clone = {};

  Object.keys(obj).forEach(function(key) {
    var value = obj[key];

    if(value instanceof Array) {
      clone[key] = value.slice();
    } else if(typeof value === 'object') {
      clone[key] = util.clone(value);
    } else {
      clone[key] = value;
    }
  });

  return clone;
};

// simple deep extend with array concatenation
util.extend = function(target, ext) {
  var clone = util.clone(target);

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

// simple directory checker
util.getDir = function(dir) {
  if(typeof dir !== 'string' || dir.length === 0) {
    return null;
  }

  dir = path.resolve(dir);
  if(!fs.existsSync(dir)) {
    return null;
  }

  return dir;
};

// converts a string to be URL-friendly
util.toURL = function(str) {
  util.alphaNumeric.lastIndex = 0;

  return str
    .replace(/-/g, ' ')
    .replace(util.alphaNumeric, '')
    .toLowerCase()
    .replace(/\s+/g, '-');
};

// camel cases a string
util.toCamelCase = function(str) {
  util.alphaNumeric.lastIndex = 0;

  return str
    .replace(util.alphaNumeric, '')
    .toLowerCase()
    .replace(/(\ [a-z])/g, function(match) {
      return match.toUpperCase().replace(/\s+/g,'');
    });
};

// hashes a string
util.createHash = function(secret) {
  var cipher = crypto.createCipher('blowfish', secret);
  return(cipher.final('hex'));
};

// creates a random token
util.createToken = function() {
  var ts = new Date().getTime(),
      rand = Math.floor(Math.random() * 9999999),
      token = ts + rand;

  return token.toString();
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
