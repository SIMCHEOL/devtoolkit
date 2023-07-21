'use strict';
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const edf_constants = require('./edf_constants');

const logger = log4js.getLogger();

class EDF_PARAMETERS {
    static async getPayload(req, res, next) {
        try {
            let result = await EDF_PARAMETERS.getData();
            utils.jsonWrapper(res, result);
        } catch (error) {
            rest_common.errorInfo(res, error);
        }
    }

    static getData() {
        logger.debug("EDF_PARAMETERS.getData()");

        let GetNetworkInfo = axios(rest_common.getOptions(command.IPC_MAP["GetNetworkInfo_WB"]));

        let result = axios.all(
            [
                GetNetworkInfo,
            ]
        ).then(axios.spread((...responses) => {
            let network_info = responses[0].data.payload;
            delete network_info.AP_LIST;
            delete network_info.SCAN_SUCCESS;
            
            return {
                par_stk_NetworkIPAddress : network_info,
            }
        }))
        .catch(error => {
          throw error;
        })

        return result;
    }
}

module.exports = EDF_PARAMETERS;