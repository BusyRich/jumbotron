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
  this.io = require('socket.io')(this.server);

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
  // add a couple configuration things at start
  this.config.config.port = process.env.PORT || 9209;
  this.config.config.hostname = 'localhost';

  // load the routes
  require(__dirname + '/routes')(this.app, this.config);

  // create a socket.io server for multi-follower presentations
  this.io.sockets.on('connection', function(socket) {
    socket.on('slidechanged', function(slide) {
      if(!slide.secret || slide.secret.length === 0) {
        return;
      }

      if(slide.secret === util.createHash(slide.socketId)) {
        slide.secret = null;
        socket.broadcast.emit(slide.socketId, slide);
      }
    });
  });

  // start the server
  this.server.listen(this.config.config.port, function() {
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
