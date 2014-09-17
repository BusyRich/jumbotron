module.exports = function(app, config) {

  app.get('*', function(req, res) {
    var pres = config.getPresentationByURL(req.path.substring(1));

    if(pres) {
      var renderContext = config.getRenderData(pres);

      if(typeof req.query['print-pdf'] === 'string') {
        renderContext.PDF = true;
      }

      return res.render(pres.file, renderContext);
    }

    res.status(404).send('Presentation Not Found');
  });

};
