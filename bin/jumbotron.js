#!/usr/bin/env node
var fs = require('fs'),
    cli = require('nomnom'),
    log = require(__dirname + '/../lib/log'),
    wDir = process.cwd();

args = cli.parse()._;

if(args.length > 0) {
  wDir = args[0];
}

wDir = require('path').resolve(wDir);

if(!fs.existsSync(wDir)) {
  log.error('"%s" is not a directory', wDir);
} else {
  require(__dirname + '/../server')(wDir).start();
}
