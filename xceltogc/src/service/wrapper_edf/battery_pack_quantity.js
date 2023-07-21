'use strict';
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const constants = require('../../lib/constants');
const edf_constants = require('./edf_constants');

const logger = log4js.getLogger();

class EDF_BATTERY_PACK_QUANTITY {
    static setParameter(req, res, next) {
        logger.debug("EDF_BATTERY_PACK_QUANTITY setParameter");
        let battery_pack_quantity = parseInt(req.body.stk_BatteryPackQuantity, 10);

        if(!rest_common.validateParameter(req.body.stk_BatteryPackQuantity) || 
            utils.checkIsNaN(battery_pack_quantity) ||
            battery_pack_quantity < edf_constants.BATTERY_NUMBER_MIN || 
            battery_pack_quantity > edf_constants.BATTERY_NUMBER_MAX) {
            rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
            return;
        }

        let SetNVM = axios(rest_common.getOptions(command.IPC_MAP["SetNVM"], { nv_items: [
            {
                name: "installed_rack_count",
                value: battery_pack_quantity,
            }
        ]}));

        axios.all(
            [
                SetNVM,
            ]
        ).then(axios.spread((...responses) => {
            let set_nvm = responses[0].data;

            if(parseInt(set_nvm.error_code, 16)) {
                logger.fatal(responses[0]);
                throw constants.ERROR_IPC_COMMUNICATION;
            }

            utils.jsonWrapper(res);
        }))
        .catch(error => {
            rest_common.errorInfo(res, error);
        })
    }
}


module.exports = EDF_BATTERY_PACK_QUANTITY;