/*
 * Loads and manages the configuration and metadata for the presentations.
 */
var util = require(__dirname + '/util'),
    _ = require('lodash');

module.exports = config = function(dir) {

  // load the configuration files
  this.config = figg = require(dir + '/' + 'jumbotron.json');
  this.reveal = require(__dirname + '/../reveal.json');
  this.meta = require(__dirname + '/../package.json');

  // sort the presentations by order, ascending
  figg.presentations.sort(function(a, b) {
    return (a.order || figg.presentations.length) -
      (b.order || figg.presentations.length);
  });

  // process the presenation information
  figg.presentations.forEach(function(pres, idx) {
    // check the required properties
    pres.index = idx;
    pres.title = pres.title || "Presentation " + (idx + 1);
    pres.url = pres.url || pres.title;
    pres.file = pres.file || util.toCamelCase(pres.title);

    // format file path
    pres.file = dir + '/' + pres.file;

    // sanitize the URL
    pres.url = util.toURL(pres.url);
  });
};

// static factory function
config.parse = function(dir) {
  return new config(dir);
};

// simple query for a presentation by its URL
config.prototype.getPresentationByURL = function(url) {
  var results = _.where(this.config.presentations, {url:url});

  if(results.length > 0) {
    return results[0];
  }

  return null;
};

// compiles the data to pass to the presentation view
config.prototype.getRenderData = function(pres) {
  return {
    presentation: pres,
    configs: {
      revealjs: this.reveal
    }
  };
};
