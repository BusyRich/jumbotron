var os = require('os'),
    fs = require('fs'),
    fsx =require('fs-extra'),
    path = require('path'),
    log = require(__dirname + '/../../lib/log');

module.exports = bundle = {};

bundle.server = function(dir, out) {
  var tmp = os.tmpdir() + '/jumbotron',
      dest = out || dir + '/jumbotron-bundle';

  // expand to an absolute path
  dest = path.resolve(dest);

  log.info('Bundling "%s"', dir);

  // clean the destination if necessary
  if(fs.existsSync(dest)) {
    fsx.removeSync(dest);
  }

  fs.mkdirSync(tmp); // make a temp working directory
  fsx.copySync(__dirname + '/../bundle/', tmp); // copy the server files
  fsx.copySync(dir, tmp); // copy the project files
  fsx.copySync(tmp, dest); // copy the temp directory to the destination
  fsx.removeSync(tmp); // clear the temp directory

  log.info('Bundle saved to "%s".', dest);
};

bundle.portable = function(dir, out) {
  var dest = out || dir + '/jumbotron-bundle',
      config = require(__dirname + '/../../lib/config').parse(dir),
      hbs  = require('express-handlebars').create(config.handlebars),
      beautify = require('js-beautify').html,
      pathMatch = /="\/(.*?)"/g,
      pathReplace = '="$1"';

  // expand to an absolute path
  dest = path.resolve(dest);

  log.info('Bundling "%s"', dir);

  // create the bundle dir
  if(fs.existsSync(dest)) {
    fsx.removeSync(dest);
  }
  fs.mkdirSync(dest);

  log.info('Creating a portal bundle');

  // tranform some paths in the reveal config
  config.reveal.dependencies.forEach(function(dep) {
    dep.src = dep.src.substring(1);
  });

  // save the HTML files
  config.jumbo.presentations.forEach(function(pres) {
    hbs.renderView(pres.file + '.hbs', config.getRenderData(pres),
      function(err, html) {
        // handle any render errors
        if(err) {
          log.error('Bundle Fialed for %s', file);
          return log.multiline('error', err.message);
        }

        // remove leading "/"s from path-like attributes
        pathMatch.lastIndex = 0;
        html = html.replace(pathMatch, pathReplace);

        // save the file
        fs.writeFileSync(
          dest + '/' + path.basename(this.file) + '.html',
          beautify(html, {
            'indent_size': 2,
            'indent_char': " "
          }));
    }.bind(pres));
  });

  // copy the project's files
  if(fs.existsSync(dir + '/public')) {
    fsx.copySync(dir + '/public', dest);
  }

  // copy over Jumbotron's public files
  fsx.copySync(__dirname + '/../../public', dest);

  log.info('Bundle saved to "%s".', dest);
};
