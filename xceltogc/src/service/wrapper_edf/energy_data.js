'use strict';
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const constants = require('../../lib/constants');
const edf_constants = require('./edf_constants');

const logger = log4js.getLogger();

class EDF_ENERGY_DATA {
    static async setParameter(req, res, next) {
        logger.debug("EDF_ENERGY_DATA setParameter");
        let consumption_power_KW = parseFloat(req.body.home_ConsumptionPowerKW);
        let consumption_power_KVA = parseFloat(req.body.home_ConsumptionPowerKVA);
        let consumption_current = parseFloat(req.body.home_ConsumptionCurrent);
        let consumption_voltage = parseFloat(req.body.home_ConsumptionVoltage);
        let production_power_KW = parseFloat(req.body.pv_ProductionPowerKW);
        let production_power_KVA = parseFloat(req.body.pv_ProductionPowerKVA);
        let production_current = parseFloat(req.body.pv_ProductionCurrent);
        let production_voltage = parseFloat(req.body.pv_ProductionVoltage);

        if(!rest_common.validateParameter(
                req.body.home_ConsumptionPowerKW, req.body.home_ConsumptionPowerKVA,
                req.body.home_ConsumptionCurrent, req.body.home_ConsumptionVoltage,
                req.body.pv_ProductionPowerKW, req.body.pv_ProductionPowerKVA,
                req.body.pv_ProductionCurrent, req.body.pv_ProductionVoltage
            ) ||
            utils.checkIsNaN(
                consumption_power_KW, consumption_power_KVA,
                consumption_current, consumption_voltage,
                production_power_KW, production_power_KVA,
                production_current, production_voltage
            )) {
            rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
            return;
        }

        let SetMeterData_WB = axios(rest_common.getOptions(command.IPC_MAP["SetMeterData_WB"],
        {
            grid_voltage: consumption_voltage,
            grid_current: consumption_current,
            grid_active_power: consumption_power_KW,
            grid_apparent_power: consumption_power_KVA,
        }
        ));

        let SetMeterData_PV_WB = axios(rest_common.getOptions(command.IPC_MAP["SetMeterData_PV_WB"],
        {
            grid_voltage: production_voltage,
            grid_current: production_current,
            grid_active_power: production_power_KW,
            grid_apparent_power: production_power_KVA,
        }
        ));

        await axios.all(
            [
                SetMeterData_WB,
                SetMeterData_PV_WB,
            ]
        ).then(axios.spread((...responses) => {
            for(let response of responses) {
                if(parseInt(response.data.error_code, 16)) {
                    logger.fatal(response, response.status);
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

module.exports = EDF_ENERGY_DATA;