#!/usr/bin/env node
var fs = require('fs'),
    cli = require('nomnom'),
    log = require(__dirname + '/../lib/log'),
    presDir = process.cwd();

args = cli.parse()._;

if(args.length > 0) {
  presDir = args[0];
}

presDir = require('path').resolve(presDir);

if(!fs.existsSync(presDir)) {
  log.error('"%s" is not a directory', presDir);
} else {
  require(__dirname + '/../server')(presDir).start();
}
