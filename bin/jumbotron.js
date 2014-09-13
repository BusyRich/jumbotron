#!/usr/bin/env node
var fs = require('fs'),
    cli = require('commander'),
    log = require(__dirname + '/../lib/log'),
    presDir = process.cwd();

cli.version('0.0.1')
  .parse(process.argv);

if(cli.args.length > 0) {
  presDir = cli.args[0];
}

presDir = require('path').resolve(presDir);

if(!fs.existsSync(presDir)) {
  log.error('"%s" is not a directory', presDir);
} else {
  require(__dirname + '/../server')(presDir).start();
}
