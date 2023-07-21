'use strict'
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const edf_constants = require('./edf_constants');

const logger = log4js.getLogger();

class EDF_METRICS {
    static async getPayload(req, res, next) {
        try {
            let result = await EDF_METRICS.getData();
            utils.jsonWrapper(res, result);
        } catch (error) {
            rest_common.errorInfo(res, error);
        }
    }

    static getData() {
        logger.debug("EDF_METRICS.getData()");

        let GetESSAllData = axios(rest_common.getOptions(command.IPC_MAP["GetESSAllData"]));
        let GetPCSSystemStatus = axios(rest_common.getOptions(command.IPC_MAP["GetPCSSystemStatus"]));
        let GetErrorHistory = axios(rest_common.getOptions(command.IPC_MAP["GetErrorHistory"]));

        let result = axios.all(
            [
                GetESSAllData,
                GetPCSSystemStatus,
                GetErrorHistory,
            ]
        ).then(axios.spread((...responses) => {
            let bat_rack_info = responses[0].data.payload.bat_info.bat_rack_info;
            let inverter_temperature = responses[0].data.payload.inverter_info.temperature_3p.inverter[0];
            let bat_history_info = responses[0].data.payload.bat_info.bat_history_info;
            let system_status_04 = responses[1].data.payload.ess_system_status[4];
            let error_history = responses[2].data.payload.err_history;

            let soc = 0;
            let rack_voltage = 0;
            let bat_relay_cnt = 0;
            let fcc = 0;

            bat_rack_info.forEach((el, idx) => {
                if(!!(system_status_04 & 0b00000001)) {
                    soc += el.soc;
                    rack_voltage += el.rack_voltage;
                    bat_relay_cnt++;

                    if(bat_history_info.hasOwnProperty(idx)) {
                        fcc += bat_history_info[idx].fcc;
                    }
                }
                system_status_04 = system_status_04 >>> 1;
            })
            
            let soc_avg = bat_relay_cnt == 0 ? 0.0 : soc / bat_relay_cnt;
            let rack_voltage_avg = bat_relay_cnt == 0 ? 0.0 : rack_voltage / bat_relay_cnt;
            let capacity = rack_voltage_avg * fcc;
            let current_error_list = error_history[error_history.length - 1].error_lists;

            soc_avg = utils.round(soc_avg);
            capacity = utils.round(capacity, 2);
            inverter_temperature = utils.round(inverter_temperature, 1);
            
            return {
                stk_SOC: soc_avg,
                stk_Capacity: capacity,
                stk_StatusCodeAlarm: current_error_list,
                stk_Temp: inverter_temperature,
            }
        }))
        .catch(error => {
            throw error;
        })

        return result;
    }
}

module.exports = EDF_METRICS;