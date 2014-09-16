var JumboServer = function(wDir) {

  // load and setup some required modules
  this.wDir = wDir;
  this.log = require(__dirname + '/lib/log');
  this.config = require(__dirname + '/lib/config').parse(wDir);
  this.util = require('./lib/util');
  this.express = require('express');
  this.exphbs  = require('express-handlebars');
  this.app = this.express();
  this.server = require('http').Server(this.app);

  // set up the public/static directories
  this.app.use(this.express.static(__dirname + '/public'));
  this.app.use(this.express.static(wDir + '/public'));

  // set up the view engine
  this.app.set('view engine', '.hbs');
  this.app.engine('.hbs', this.exphbs({
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    defaultLayout: 'default',
    extname: '.hbs',
    helpers: {
      'json': function(json) {
        return JSON.stringify(json, null, 2);
      }
    }
  }));
};

JumboServer.prototype.start = function() {

  // load the routes
  this.app.get('*', function(req, res) {
    var pres = this.config.getPresentationByURL(req.path.substring(1));

    if(pres) {
      var renderContext = this.config.getRenderData(pres);

      if(typeof req.query['print-pdf'] === 'string') {
        renderContext.PDF = true;
      }

      return res.render(pres.file, renderContext);
    }

    res.status(404).send('Presentation Not Found');
  }.bind(this));

  // start the server
  this.server.listen(process.env.PORT || 9209, function() {
    this.log.multiline('info', this.util.getLogo());
    this.log.info('Jumbotron server listening on port %d',
      this.server.address().port);

    this.log.info('Version: %s', this.config.meta.version);
  }.bind(this));
};

// export a Jumbotron factory
module.exports = function(wDir) {
  return new JumboServer(wDir);
};
