'use strict';
const path = require('path');
const axios = require('axios');
const log4js = require('../lib/logger');
const command = require('../lib/command');
const rest_common = require('../lib/rest-common');
const utils = require('../lib/utils');
const config = require('../config/config');
const constants = require('../lib/constants');

const logger = log4js.getLogger();
class EmsUpdate {
  static async updateEmsManual(req, res) {
    logger.debug("manual update");
    let system_status, ems_status, fota_status;
    let firmware_info = {
      fw_info_flag: 0,
      ems_fw_name: '',
      ems_app_name: '',
      pcs_fw_name: '',
      bms_fw_name: '',
      bdc_fw_name: '',
      afci_fw_name: '',
      opt_fw_name: '',
      hub_fw_name: '',
    };

    // Memory check
    system_status = await axios(rest_common.getOptions(command.IPC_MAP["GetSystemStatus"]))
    .then(resp => resp.data).catch(error => error);

    if(parseInt(system_status.error_code, 16) !== constants.IPC_RESPONSE_CODE_SUCCESS) {
      rest_common.errorInfo(res, system_status);
      return;
    }

    if(typeof system_status.payload.free_mem === 'undefined' || system_status.payload.free_mem < req.files.ems_file.size/1024) {
      rest_common.errorInfo(res, constants.ERROR_NOT_ENOUGH_EMS_MEMORY);
      return;
    }

    // EMS status check
    ems_status = await axios(rest_common.getOptions(command.IPC_MAP["GetEmsState_WB"]))
    .then(resp => resp.data).catch(error => error);

    if(parseInt(ems_status.error_code, 16) !== constants.IPC_RESPONSE_CODE_SUCCESS) {
      rest_common.errorInfo(res, ems_status);
      return;
    }

    // Checking EMS status if IDLE or Cloud Manager
    if(parseInt(ems_status.payload.ems_state, 16) === constants.EMS_STATE_IDLE 
    || parseInt(ems_status.payload.ems_state, 16) === constants.EMS_STATE_DOWNLOAD_CM) {
      ems_status = await axios(rest_common.getOptions(command.IPC_MAP["ChangeEMSState"], { ems_state: constants.EMS_STATE_DOWNLOAD_WE }))
      .then(resp => resp.data)
      .catch(error => error)

      if(parseInt(ems_status.error_code, 16) !== 0) {
        rest_common.errorInfo(res, ems_status);
        return;
      }
    }

    // Checking EMS status if Webbase
    ems_status = await axios(rest_common.getOptions(command.IPC_MAP["GetEmsState_WB"]))
    .then(resp => resp.data).catch(error => error);

    if(parseInt(ems_status.error_code, 16) !== constants.IPC_RESPONSE_CODE_SUCCESS) {
      rest_common.errorInfo(res, ems_status);
      return;
    }

    // File upload
    if(parseInt(ems_status.payload.ems_state, 16) === constants.EMS_STATE_DOWNLOAD_WE) {
      if (req.files && Object.keys(req.files).length > 0) {
        let ems_file = req.files.ems_file;
        let target_full_path = config.server.firmwarePath + ems_file.name;
        await ems_file.mv(target_full_path);

        if (path.extname(target_full_path) == '.zip') {
          firmware_info.ems_fw_name = target_full_path;
          firmware_info.ems_app_name = target_full_path;
          firmware_info.fw_info_flag += constants.FW_INFO_EMS + constants.FW_INFO_EMS_APP;
        } else {
          if (ems_file.name.substring(2,5) == 'ALL') {
            firmware_info.ems_fw_name = target_full_path;
            firmware_info.fw_info_flag += constants.FW_INFO_EMS;
          } else {
            firmware_info.ems_app_name = target_full_path;
            firmware_info.fw_info_flag += constants.FW_INFO_EMS_APP;
          }
        }
      } else {
        rest_common.errorInfo(res, constants.ERROR_FAIL_TO_UPDATE_FILE);
      }
    } else {
      rest_common.errorInfo(res, ems_status);
      return;
    }

    // Request to FOTA
    fota_status = await axios(rest_common.getOptions(command.IPC_MAP["UpdateFirmware"], firmware_info))
    .then(resp => resp.data).catch(error => error);

    if(parseInt(fota_status.error_code, 16) !== constants.IPC_RESPONSE_CODE_SUCCESS) {
      rest_common.errorInfo(res, fota_status);
      return;
    }

    res.json(fota_status);
    return;
  }
}

module.exports = EmsUpdate;