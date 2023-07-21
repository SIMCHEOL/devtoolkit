'use strict';
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const constants = require('../../lib/constants');
const edf_constants = require('./edf_constants');

const logger = log4js.getLogger();

class EDF_POWER_REQUEST {
    static async setParameter(req, res, next) {
        logger.debug("EDF_POWER_REQUEST setParameter");
        let op_mode = parseInt(req.body.stk_OpMode, 10);
        let power_request = parseInt(req.body.stk_PowerRequest, 10);
        let ipcs = [];

        if(!rest_common.validateParameter(req.body.stk_OpMode, req.body.stk_PowerRequest) ||
            utils.checkIsNaN(op_mode, power_request)) {
            rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
            return;
        }

        ipcs.push(axios(rest_common.getOptions(command.IPC_MAP["SetPCSMode"],
        {
            operation_mode_e: op_mode
        }
        )));

        if(op_mode === edf_constants.OP_MODE_MANUAL) {
            ipcs.push(axios(rest_common.getOptions(command.IPC_MAP["SetCommandControl"],
            {
                pw_control_point: edf_constants.PCS_CONTROL_POINT_INV,
                inv_target_power: power_request,
                bat_target_power: parseInt(0, 10),
                pv_power_limit: parseInt(0, 10),
            }
            )));
        }

        await axios.all(
            ipcs
        ).then(axios.spread((...responses) => {
            for(let response of responses) {
                if(parseInt(response.data.error_code, 16)) {
                    logger.fatal(response);
                    throw constants.ERROR_IPC_COMMUNICATION;
                }
            }

            utils.jsonWrapper(res);
        }))
        .catch(error => {
          rest_common.errorInfo(res, error);
        })
    }
}

module.exports = EDF_POWER_REQUEST;