'use strict';
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const edf_constants = require('./edf_constants');

const logger = log4js.getLogger();

class EDF_CONFIG {
    static async getPayload(req, res, next) {
        try {
            let result = await EDF_CONFIG.getData();
            utils.jsonWrapper(res, result);
        } catch (error) {
            rest_common.errorInfo(res, error);
        }
    }

    static getData() {
        logger.debug("EDF_CONFIG.getData()");

        let GetNVM = axios(rest_common.getOptions(command.IPC_MAP["GetNVM"], { nv_items: [{name:"EMS_serial_number"}]}));
        let GetBattSerialNumber_WB = axios(rest_common.getOptions(command.IPC_MAP["GetBattSerialNumber_WB"]));
        let GetESSVersionInfo = axios(rest_common.getOptions(command.IPC_MAP["GetESSVersionInfo"]));
        let GetEmsInfo = axios(rest_common.getOptions(command.IPC_MAP["GetEmsInfo_WB"]));

        let result = axios.all(
            [
                GetNVM,
                GetBattSerialNumber_WB,
                GetESSVersionInfo,
                GetEmsInfo,
            ]
        ).then(axios.spread((...responses) => {
            let ems_serial_info = responses[0].data.payload;
            let qsave_serial_info = responses[1].data.payload.qsave_sn;
            let ess_version_info = responses[2].data.payload;
            let ems_version_info = responses[3].data.payload;
            
            let ems_serial_number = {
                ems_serial_number: ems_serial_info.EMS_serial_number,
                qsave_serial_number: qsave_serial_info
            }

            let hardware_version = {
                ems_hw_version: ems_version_info.ems_hw_version,
                ems_hw_model: ems_version_info.ems_model,
                pcs_hw_version: ess_version_info.pcs_version.pcs_hw_version,
            }

            let software_version = {
                ems_sw_version: ems_version_info.ems_sw_version,
                ems_build_date: ems_version_info.ems_build_date,
                pcs_master_fw_version: ess_version_info.pcs_version.pcs_master_fw_version,
                pcs_slave_fw_version: ess_version_info.pcs_version.pcs_slave_fw_version,
                bms_sw_version: [
                    ess_version_info.bms_sw_version1,
                    ess_version_info.bms_sw_version2,
                    ess_version_info.bms_sw_version3,
                ]
            }

            return {
                stk_SerialNumber : ems_serial_number,
                stk_HardwareVersion: hardware_version,
                stk_SoftwareVersion: software_version,
            }
        }))
        .catch(error => {
            throw error;
        })
        
        return result;
    }
}

module.exports = EDF_CONFIG;