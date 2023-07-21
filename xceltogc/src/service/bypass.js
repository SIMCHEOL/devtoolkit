'use strict';
const axios = require('axios');
const log4js = require('../lib/logger');
const rest_common = require('../lib/rest-common');
const command = require('../lib/command');

const logger = log4js.getLogger();
class ByPassFilter {
  static get(req, res) {
    axios(rest_common.getOptions(command.IPC_MAP[req.params.ipc], req.body))
    .then(resp => {
      logger.debug("ByPassFilter : ", typeof resp.data.payload === "undefined" ? resp.data : resp.data.payload);
      
      if("POST" === req.method.toUpperCase()) {
        res.json(resp.data);
      } else {
        res.json(resp.data.payload);
      }
    })
    .catch(error => {
      rest_common.errorInfo(res, error);
    })
  }

  static set(req, res) {
    res.json('set test');
  }
}

module.exports = ByPassFilter;