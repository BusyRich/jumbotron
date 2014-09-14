var nodeunit = require('nodeunit'),
    util = require(__dirname + '/../lib/util');

var extend = function(test) {
  var o1 = {str:'test',num:2,arr:['one','two'],obj:{one:'two',three:'five'}},
      o2 = {num:3,arr:['three'],obj:{three:4}};

  test.expect(1);

  test.deepEqual(
    util.extend(o1, o2),
    {str:'test',num:3,arr:['one','two','three'],obj:{one:'two',three:4}},
    "extend should provide a deep extension with array concatenation");

  test.done();
};

var toURL = function(test) {
  test.expect(1);

  test.equal(util.toURL('test12#42* to^URL'), 'test1242-tourl',
    'toURL should create a alpha-numeric, dashed string');

  test.done();
};

var toCamelCase = function(test) {
  test.expect(1);

  test.equal(util.toCamelCase('test12#42* to^URL'), 'test1242Tourl',
    'toURL should create a alpha-numeric, camel-cased string');

  test.done();
};

module.exports = {
  extend: extend,
  toURL: toURL,
  toCamelCase: toCamelCase
};
