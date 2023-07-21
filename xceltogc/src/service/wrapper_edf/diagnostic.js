'use strict';
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const edf_constants = require('./edf_constants');

const logger = log4js.getLogger();

class EDF_DIAGNOSTIC {
    static async getPayload(req, res, next) {
        try {
            let result = await EDF_DIAGNOSTIC.getData();
            utils.jsonWrapper(res, result);
        } catch (error) {
            rest_common.errorInfo(res, error);
        }
    }

    static getData() {
        logger.debug("EDF_DIAGNOSTIC.getData()");

        let GetESSAllData = axios(rest_common.getOptions(command.IPC_MAP["GetESSAllData"]));
        let GetCommandControl = axios(rest_common.getOptions(command.IPC_MAP["GetPCSMode"]));
        let GetNVM = axios(rest_common.getOptions(command.IPC_MAP["GetNVM"], { nv_items: [
            { name: "Inverter_limit" },
            { name: "installed_rack_count" },
            { name: "gateway_conn" },
        ]}));
        let GetSystemRestartCount = axios(rest_common.getOptions(command.IPC_MAP["GetSystemRestartCount"]));
        let GetHeartBeat_WB = axios(rest_common.getOptions(command.IPC_MAP["GetHeartBeat_WB"]));

        let result = axios.all(
            [
                GetESSAllData,
                GetCommandControl,
                GetNVM,
                GetSystemRestartCount,
                GetHeartBeat_WB,
            ]
        ).then(axios.spread((...responses) => {
            let current_AC = utils.round(responses[0].data.payload.inverter_info.inv_3p.current[edf_constants.POWER_PHASE_TYPE_SINGLE], 3);

            let current_dc_array = responses[0].data.payload.inverter_info.bdc.current;
            let current_DC = 0;
            for(let current_dc_tmp of current_dc_array) {
                current_DC += current_dc_tmp;
            }
            current_DC = utils.round(current_DC, 3);

            let voltage_AC = utils.round(responses[0].data.payload.inverter_info.inv_3p.voltage[edf_constants.POWER_PHASE_TYPE_SINGLE]);
            let voltage_DC = utils.round(responses[0].data.payload.inverter_info.bdc.voltage);

            let inv_target_power = utils.round(responses[0].data.payload.control_info.inv_target_power);

            let power = utils.round(responses[0].data.payload.inverter_info.inv_3p.active_power[edf_constants.POWER_PHASE_TYPE_SINGLE], 3);

            let op_mode = responses[1].data.payload.operation_mode_e;

            let inverter_limit = responses[2].data.payload.Inverter_limit;
            let installed_rack_count = responses[2].data.payload.installed_rack_count;

            let system_restart_counter = responses[3].data.payload.system_restart_count;

            let heart_beat = responses[4].data.payload.heart_beat;

            return {
                stk_CurrentAC: current_AC,
                stk_CurrentDC: current_DC,
                stk_VoltageAC: voltage_AC,
                stk_VoltageDC: voltage_DC,
                stk_Power: power,
                stk_OpMode: op_mode,
                stk_PowerRequest: inv_target_power,
                stk_InputMax: utils.round(-inverter_limit),
                stk_OutputMax: utils.round(inverter_limit),
                stk_BatteryPackQuantity: installed_rack_count,
                stk_StorageSystemRestartCounter: system_restart_counter,
                stk_Heartbeat: heart_beat,
            }
        }))
        .catch(error => {
            throw error;
        })
        
        return result;
    }
}

module.exports = EDF_DIAGNOSTIC;