'use strict';
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const constants = require('../../lib/constants');
const edf_constants = require('./edf_constants');

const logger = log4js.getLogger();

class EDF_COMMISSIONING {
    static async getPayload(req, res, next) {
        try {
            let result = await EDF_COMMISSIONING.getData();
            utils.jsonWrapper(res, result);
        } catch (error) {
            rest_common.errorInfo(res, error);
        }
    }

    static getData() {
        logger.debug("EDF_COMMISSIONING.getData()");

        let GetNVM = axios(rest_common.getOptions(command.IPC_MAP["GetNVM"], { nv_items: [
            { name: "grid_code" },
            { name: "feed_in_limit_w" },
            { name: "grid_target_frequency" },
            { name: "multiple_earthed_neutral_system_flag" },
            { name: "installed_rack_count" },
            { name: "battery_backup_soc" },
            { name: "reactpwr_cospi_setpoint_flag" },
            { name: "reactpwr_cospi_setpoint_excited_flag" },
            { name: "reactpwr_cospi_setpoint_value" },
        ]}));

        let result = axios.all(
            [
                GetNVM,
            ]
        ).then(axios.spread((...responses) => {
            let payload = responses[0].data.payload;
            
            return {
                stk_GridCode: payload.grid_code,
                stk_FeedInLimit: payload.feed_in_limit_w,
                stk_GridTargetFrequency: payload.grid_target_frequency,
                stk_MENSystemFlag: payload.multiple_earthed_neutral_system_flag,
                stk_BatteryPackQuantity: payload.installed_rack_count,
                stk_UserBackupSoC: payload.battery_backup_soc,
                stk_FixedPowerFactorMode: payload.reactpwr_cospi_setpoint_flag,
                stk_SetPointExcited: payload.reactpwr_cospi_setpoint_excited_flag,
                stk_PowerFactorValue: payload.reactpwr_cospi_setpoint_value,
            }
        }))
        .catch(error => {
            throw error;
        })

        return result;
    }
}

module.exports = EDF_COMMISSIONING;