var util = require('util'),
    winston = require('winston');
    logger = new winston.Logger({
      transports: [
        new winston.transports.Console({
          colorize: true,
          prettyPrint: true
        })
      ]
    });

logger.multiline = function(level, text) {
  text.split('\n').forEach(function(line) {
    logger[level](line);
  });
};

logger.json = function(level, obj) {
  JSON.stringify(obj, null, 2).split('\n').forEach(function(line) {
    logger[level](line);
  });
};

logger.cli();
module.exports = logger;
