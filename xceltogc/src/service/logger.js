'use strict';
const path = require('path');
const axios = require('axios');
const log4js = require('../lib/logger');
const command = require('../lib/command');
const rest_common = require('../lib/rest-common');
const utils = require('../lib/utils');
const config = require('../config/config');
const constants = require('../lib/constants');

const logger = log4js.getLogger();
class Logger {
  static set(req, res) {
    if(typeof req.body.loglevel === "undefined" ||
      typeof log4js.getLogLevel().find((el) => el === req.body.loglevel) === "undefined") {
      rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
      return;
    }

    try {
      log4js.setLogConfigure(req.body.loglevel);
      logger.fatal("Log level[%s] is set.", req.body.loglevel);
      utils.jsonWrapper(res);
      return;
    } catch (error) {
      logger.error(error);
      rest_common.errorInfo(res, error);
    }
  }

  static test(req, res) {
    logger.trace("======= log4js trace =====");
    logger.debug("======= log4js debug =====");
    logger.info( "======= log4js info ======");
    logger.warn( "======= log4js warn ======");
    logger.error("======= log4js error =====");
    logger.fatal("======= log4js fatal =====");
    utils.jsonWrapper(res);
  }
}

module.exports = Logger;