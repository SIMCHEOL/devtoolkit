'use strict';
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const config = require('../../config/config');
const constants = require('../../lib/constants');

const logger = log4js.getLogger();
class EmsCalibrationGet {
    static async getCalibrationCommon(req, res) {
        const ipc_map = {
            afci: "GetAFCICalibrationData",
            dc: "GetPCSCalibrationDcData",
            hub: "GetHubCalibrationData",
        }
        const ipc_target = ipc_map[req.params.device];
        logger.debug("getCalibrationCommon", ipc_target);
        if(typeof ipc_target === "undefined") {
            rest_common.errorInfo(res, constants.CAN_NOT_FIND_IPC);
            return;
        }

        let result = await axios(rest_common.getOptions(command.IPC_MAP[ipc_target], {}, 30 * 1000))
        .then(resp => {
          return resp.data;
        })
        .catch(error => {
          logger.fatal(error);
          return constants.ERROR_IPC_COMMUNICATION_CATCH;
        })
        
        if (result === null) {
            rest_common.errorInfo(res, constants.CAN_NOT_FIND_IPC);
        } else if(typeof result === "undefined" || parseInt(result.error_code, 16)) {
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
    }

    static async getCalibrationAc(req, res) {
        logger.debug("getCalibrationAc");
        if(!(String(req.params.phase).toUpperCase() in constants.PHASE)) {
            rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
            return;
        }

        const phase = constants.PHASE[String(req.params.phase).toUpperCase()];
        let result = null;

        result = await axios(rest_common.getOptions(command.IPC_MAP["GetPCSCalibrationAcData"], { phase_type: phase }, 30 * 1000))
        .then(resp => {
          return resp.data;
        })
        .catch(error => {
          logger.fatal(error);
          return constants.ERROR_IPC_COMMUNICATION_CATCH;
        })

        if (result === null) {
            rest_common.errorInfo(res, constants.CAN_NOT_FIND_IPC);
        } else if(typeof result === "undefined" || parseInt(result.error_code, 16)) {
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
    }

    static async getCalibrationBdc(req, res) {
        logger.debug("getCalibrationBdc");
        if(parseInt(req.params.rack_id, 10) > constants.RACK_ID_MAX) {
            rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
            return;
        }

        const rack_id = parseInt(req.params.rack_id, 10);
        let result = null;

        result = await axios(rest_common.getOptions(command.IPC_MAP["GetBDCCalibrationData"], { rackId: rack_id }, 30 * 1000))
        .then(resp => {
          return resp.data;
        })
        .catch(error => {
          logger.fatal(error);
          return constants.ERROR_IPC_COMMUNICATION_CATCH;
        })

        if (result === null) {
            rest_common.errorInfo(res, constants.CAN_NOT_FIND_IPC);
        } else if(typeof result === "undefined" || parseInt(result.error_code, 16)) {
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
    }
}

module.exports = EmsCalibrationGet;