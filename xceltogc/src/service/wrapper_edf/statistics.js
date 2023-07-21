'use strict'
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const edf_constants = require('./edf_constants');

const logger = log4js.getLogger();

class EDF_STATISTICS {
    static async getPayload(req, res, next) {
        try {
            let result = await EDF_STATISTICS.getData();
            utils.jsonWrapper(res, result);
        } catch (error) {
            rest_common.errorInfo(res, error);
        }
    }

    static getData() {
        logger.debug("EDF_STATISTICS.getData()");

        let GetESSAllData = axios(rest_common.getOptions(command.IPC_MAP["GetESSAllData"]));
        let GetPCSSystemStatus = axios(rest_common.getOptions(command.IPC_MAP["GetPCSSystemStatus"]));

        let result = axios.all(
            [
                GetESSAllData,
                GetPCSSystemStatus,
            ]
        ).then(axios.spread((...responses) => {
            let bat_rack_info = responses[0].data.payload.bat_info.bat_rack_info;
            let system_status_04 = responses[1].data.payload.ess_system_status[4];

            let soh = 0;
            let bat_relay_cnt = 0;

            bat_rack_info.forEach((el, idx) => {
                if(!!(system_status_04 & 0b00000001)) {
                    soh += el.soh;
                    bat_relay_cnt++;
                }
                system_status_04 = system_status_04 >>> 1;
            })
            
            let soh_avg = bat_relay_cnt == 0 ? 0.0 : soh / bat_relay_cnt;
            soh_avg = utils.round(soh_avg, 1);
            
            return {
                stk_SOH: soh_avg,
            }
        }))
        .catch(error => {
          throw error;
        })

        return result;
    }
}


module.exports = EDF_STATISTICS;