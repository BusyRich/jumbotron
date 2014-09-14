var path = require('path'),
    config = require(__dirname + '/../lib/config').parse(__dirname);

var reveal = function(test) {
  test.expect(1);

  test.ok(
    config.reveal,
    "reveal configuration should be loaded");

  test.done();
};

var order = function(test) {
  test.expect(4);

  test.equal(
    config.config.presentations[0].title,
    'Test Two',
    "Test Two should be first in the presentations array");

  test.equal(
    config.config.presentations[1].title,
    'Test One',
    "Test One should be second in the presentations array");

  test.equal(
    config.config.presentations[2].title,
    'Test Three',
    "Test Three should be third in the presentations array");

  test.equal(
    config.config.presentations[3].title,
    'Presentation 4',
    "Test Four should be fourth in the presentations array");

  test.done();
};

var file = function(test) {
  test.expect(4);

  test.equal(
    config.config.presentations[0].file,
    path.resolve(__dirname, 'testTwo'),
    "Test Two should have a file of 'testTwo'");

  test.equal(
    config.config.presentations[1].file,
    path.resolve(__dirname, 'test'),
    "Test One should have a file of 'test'");

  test.equal(
    config.config.presentations[2].file,
    path.resolve(__dirname, 'testThree'),
    "Test Three should have a file of 'testThree'");

  test.equal(
    config.config.presentations[3].file,
    path.resolve(__dirname, 'testFour'),
    "Presentation 4 should have a file of 'testFour'");

  test.done();
};

var url = function(test) {
  test.expect(4);

  test.equal(
    config.config.presentations[0].url,
    'test-two',
    "Test Two should have a url of 'test-two'");

  test.equal(
    config.config.presentations[1].url,
    'test-one',
    "Test One should have a url of 'test-one'");

  test.equal(
    config.config.presentations[2].url,
    'test-number-three',
    "Test Three should have a url of 'test-number-three'");

  test.equal(
    config.config.presentations[3].url,
    'presentation-4',
    "Presentation 4 should have a url of 'presentation-4'");

  test.done();
};

var getPresByURL = function(test) {
  var pres = config.getPresentationByURL('test-two');

  test.expect(5);

  test.equal(pres.title, 'Test Two',
    "Retrieved presentation should have a title of 'Test Two'");

  test.equal(pres.order, 1,
    "Retrieved presentation should have an order of 1");

  test.equal(pres.index, 0,
    "Retrieved presentation should have an index of 0");

  test.equal(pres.file, path.resolve(__dirname, 'testTwo'),
    "Retrieved presentation should have a file of 'testTwo'");

  test.equal(pres.url, 'test-two',
    "Retrieved presentation should have an URL of 'test-two'");

  test.done();
};

var getData = function(test) {
  var data = config.getRenderData(config.config.presentations[0]);

  test.expect(2);

  test.equal(data.presentation.title, 'Test Two',
    "Retrieved presentation should have a title of 'Test Two'");

  test.ok(
    data.configs.revealjs,
    "reveal configuration should be added to the render data");

  test.done();
};

module.exports = {
  reveal: reveal,
  order: order,
  file: file,
  url: url,
  getPresentationByURL: getPresByURL,
  getRenderData: getData
};
