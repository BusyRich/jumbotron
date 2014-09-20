#!/usr/bin/env node
var util = require(__dirname + '/../lib/util'),
    cli = require('nomnom').script('jumbotron'),
    log = require(__dirname + '/../lib/log'),
    commands = {
      bundle: require(__dirname + '/commands/bundle')
    };

cli
  .option('portable', {
      abbr: 'p',
      flag: true
   })
   .option('out', {
       abbr: 'o'
    });

var opts = cli.nom();
    args = opts._;

if(args.length === 0 || !commands[args[0]]) {

  // get the working/project directory for the Jumbotron server
  var wDir = process.cwd();
  if(args.length > 0) {
    wDir = util.getDir(args[0]);
  }

  if(!wDir) {
    log.error('Cannot Run Jumbotron: Directory does not exist "%s"', args[0]);
  } else {
    require(__dirname + '/../server')(wDir).start();
  }
} else if(args[0] === 'bundle') {
  commands.bundle(opts, args);
}
