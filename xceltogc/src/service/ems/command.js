'use strict';
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const config = require('../../config/config');
const constants = require('../../lib/constants');

const logger = log4js.getLogger();
class EmsCommand {
  static async sendIpc(req, res) {
    let req_command = req.params.command;
    let req_method = req.method.toUpperCase();
    let result = null;
    logger.debug("[IPC: %s, METHOD: %s] : ", req_command, req_method);

    for(let cmd in command.IPC_MAP) {
      if(command.IPC_MAP[cmd].api === req_command && command.IPC_MAP[cmd].method.code === req_method) {
        result = await axios(rest_common.getOptions(command.IPC_MAP[cmd], req.body))
        .then(resp => {
          logger.debug("sendIpc[" + req_command + "] : complete!", resp.data);
          return resp.data;
        })
        .catch(error => {
          logger.fatal(error);
          return constants.ERROR_IPC_COMMUNICATION_CATCH;
        })
      }
    }

    if (result === null) {
      rest_common.errorInfo(res, constants.CAN_NOT_FIND_IPC);
    } else if(result === null || typeof result === "undefined" || parseInt(result.error_code, 16)) {
      let res_error = JSON.parse(JSON.stringify(constants.ERROR_IPC_COMMUNICATION));
      res_error.response.error_code = result.error_code;
      rest_common.errorInfo(res, res_error);
    } else {
      if(typeof result.payload === "undefined") {
        result.payload = {};
      }
      result.payload.error_code = result.error_code;
      utils.jsonWrapper(res, result.payload);
    }
    
    return;
  }
}

module.exports = EmsCommand;