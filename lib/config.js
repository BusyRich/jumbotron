/*
 * Loads and manages the configuration and metadata for the presentations.
 */
var util = require(__dirname + '/util'),
    _ = require('lodash');

module.exports = config = function(dir) {

  // load the configuration files
  this.jumbo = require(__dirname + '/../config/jumbotron.json');
  this.jumbo = util.extend(this.jumbo, require(dir + '/' + 'jumbotron.json'));

  this.handlebars = require(__dirname + '/../config/handlebars.json');
  this.reveal = require(__dirname + '/../config/reveal.json');
  this.meta = require(__dirname + '/../package.json');

  var figg = this.jumbo;

  // set the port to the PORT environment variable if available
  figg.port = process.env.PORT || figg.port;

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

  // set some handlebars options
  this.handlebars.layoutsDir = __dirname + '/../views/layouts/';
  this.handlebars.partialsDir = __dirname + '/../views/partials/';
  this.handlebars.helpers = require(__dirname + '/helpers');
};

// static factory function
config.parse = function(dir) {
  return new config(dir);
};

// simple query for a presentation by its URL
config.prototype.getPresentationByURL = function(url) {
  var results = _.where(this.jumbo.presentations, {url:url});

  if(results.length > 0) {
    return results[0];
  }

  return null;
};

// compiles the data to pass to the presentation view
config.prototype.getRenderData = function(pres) {
  return {
    hostname: this.jumbo.hostname,
    port: this.jumbo.port,
    css: this.jumbo.css,
    hljs: this.jumbo.hljsTheme,
    clientHost: this.jumbo.clientHost ||
      (this.jumbo.hostname + ':' + this.jumbo.port),
    presentation: util.clone(pres),
    configs: {
      revealjs: util.clone(this.reveal)
    }
  };
};

// takes a generated context and adds multiplex (master/follow) support
// to the reveal.js configuration
config.prototype.addMultiplex = function(ctx, socketId, follow) {
  var id = socketId;
  if(typeof id !== 'string' || id.length <= 0) {
    id = util.createToken();
  }

  ctx.configs.revealjs.multiplex = {
    id: id,
    secret: (!follow ? util.createHash(id) : null),
    url: ctx.clientHost
  };

  ctx.configs.revealjs.dependencies.push({
    src: '//' + ctx.clientHost + '/socket.io/socket.io.js',
    async: true
  });

  ctx.configs.revealjs.dependencies.push({
    src: '/js/reveal/plugins/multiplex/' +
      (!follow ? 'master.js' : 'client.js'),
    async: true
  });
};
