'use strict';
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const edf_constants = require('./edf_constants');

const logger = log4js.getLogger();

class EDF_STATE {
    static async getPayload(req, res, next) {
        try {
            let result = await EDF_STATE.getData();
            utils.jsonWrapper(res, result);
        } catch (error) {
            rest_common.errorInfo(res, error);
        }
    }

    static getData() {
        logger.debug("EDF_STATE.getData()");

        let GetPCSSystemStatus = axios(rest_common.getOptions(command.IPC_MAP["GetPCSSystemStatus"]));
        let GetErrorHistory = axios(rest_common.getOptions(command.IPC_MAP["GetErrorHistory"]));

        let result = axios.all(
            [
                GetPCSSystemStatus,
                GetErrorHistory,
            ]
        ).then(axios.spread((...responses) => {
            let system_status_03 = responses[0].data.payload.ess_system_status[3];
            let error_history = responses[1].data.payload.err_history;

            let reley_grid = system_status_03 & 0b00000001;
            let relay_inv_mainload = system_status_03 & 0b00000010;
            let backup_status = system_status_03 & 0b00000100 ? true : false;
            let mode = reley_grid + relay_inv_mainload;
            let current_error_list = error_history[error_history.length - 1].error_lists;
            let pcs_connection_error = current_error_list.indexOf(edf_constants.EMS_ERROR_PCS_CONNECTION) == -1 ? 0 : 0b100;
            mode |= pcs_connection_error;
            /**
             * mode == 0 : relay_grid off & relay_inv off => off load
             * mode == 1 : relay_grid on & relay_inv off => off load 
             * mode == 2 : relay_grid off & relay_inv on => off load
             * mode == 3 : relay_grid on & relay_inv on => on load
             * mode == 4,5,6,7 : fault => pcs connection fault
             */
            
            return {
                stk_Mode: mode,
                stk_BackupStatus: backup_status,
            }
        }))
        .catch(error => {
            throw error;
        })

        return result;
    }
}

module.exports = EDF_STATE;