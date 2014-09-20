var fs = require('fs'),
    util = require(__dirname + '/../../lib/util'),
    log = require(__dirname + '/../../lib/log'),
    bundle = require(__dirname + '/../controllers/bundle');

module.exports = function(opts, args) {
  var target = process.cwd(), out;

  // get the directory to bundle, if not CWD
  if(args.length > 1) {
    target = util.getDir(args[1]);
  }

  if(!target) {
    return log.error('Cannot bundle "%s": Directory does not exist', args[1]);
  } else if(!fs.existsSync(target + '/jumbotron.json')) {
    // simple sanity check to make sure it's a Jumbotron project
    return log.error('Cannot bundle "%s": No jumbotron.json found', target);
  }

  if(opts.portable) {
    bundle.portable(target, opts.out);
  } else {
    bundle.server(target, opts.out);
  }
};
