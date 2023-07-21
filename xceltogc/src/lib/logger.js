const log4js = require("log4js");
const config = require('../config/config')

log4js.setLogConfigure = function(loglevel = config.log.level) {
log4js.configure({
  appenders: {
    console: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: `%[[%d{hh:mm:ss:SSS}][%.1p][API] %m%]`,
        //type: 'coloured'
      }
    }
  },
  categories: {
    default: {
      appenders: ['console'],
      level: loglevel,
      enableCallStack: true
    }
  }
})
};

log4js.getLogLevel = function() {
  return ["trace", "debug", "info", "warn", "error", "fatal"];
}

log4js.setLogConfigure()

module.exports = log4js;
