'use strict'
const config = require('../config/config');
const log4js = require('./logger');
const command = require('./command');
const utils = require('./utils');
const constants = require('./constants');
const https = require('https');

const logger = log4js.getLogger();

function getOptions(ipc, payload = {}, timeout = 10000) {
  if(!ipc) {
    throw constants.CAN_NOT_FIND_IPC;
  }

  let req = new command.Command(ipc.id, ipc.commandTo, ipc.method);

  if(logger.isDebugEnabled()) {
    logger.debug("getOptions > ", {
      method: req.method,
      to: req.to.code,
      sub_cmd: req.code,
      payload: payload,
    })
  }
  return {
    method: req.method,
    url: `${config.api.endpoint}:${config.api[[req.method]]}`,
    timeout: timeout, // 10 seconds
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'x-http-method-override': 'POST',
    },
    data: {
      to: req.to.code,
      sub_cmd: req.code,
      payload: payload,
    },
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
  }
}

function errorInfo(res, error) {
  let status = (error ? (error.response ? (error.response.status ? error.response.status : 500) : 500) : 500);
  logger.error("[errorInfo(" + status + ")]", error);
  res.status(status);

  if(!utils.isJson(error)) {
    error = { 
      response: { 
        error_text: "Error can't be stringified. It could be sent from internal system",
        status: 500,
      }
    }
  }
  res.json(error);
}

function validateParameter(...params) {
  for(let param of params) {
    if(typeof param === "undefined" || param === null || param === "") {
      logger.error("invalid param > ", params)
      return false;
    }
  }
  return true;
}

module.exports = {
  getOptions,
  errorInfo,
  validateParameter,
}