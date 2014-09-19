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
  this.app.engine('.hbs', this.exphbs(this.config.handlebars));
};

JumboServer.prototype.start = function() {
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
  this.server.listen(this.config.jumbo.port, function() {
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
