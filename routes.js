module.exports = function(app, config) {
  var hostname;

  app.get('*', function(req, res) {
    var pres = config.getPresentationByURL(req.path.substring(1));
    hostname = req.headers.host.split(':')[0]; // get the hostname

    // set the hostname in the config if a different on is used by a client
    if(hostname !== config.jumbo.hostname) {
      config.jumbo.hostname = req.hostname;
    }

    if(pres) {
      var renderContext = config.getRenderData(pres);

      // load the necessary PDF/print CSS if requested
      if(typeof req.query['print-pdf'] === 'string') {
        renderContext.PDF = true;
      }

      // setup the reveal.js configuration for multiplex if requested
      if(typeof req.query.master === 'string' ||
        typeof req.query.follow === 'string')
      {
        config.addMultiplex(renderContext, req.query.id,
          typeof req.query.follow === 'string');
      }

      return res.render(pres.file, renderContext);
    }

    res.status(404).send('Presentation Not Found');
  });

};
