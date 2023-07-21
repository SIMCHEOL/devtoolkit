'use strict';
const axios = require('axios');
const log4js = require('../lib/logger');
const command = require('../lib/command');
const rest_common = require('../lib/rest-common');
const utils = require('../lib/utils');
const config = require('../config/config');

const logger = log4js.getLogger();
class RestApiInfo {
  static async getVersion(req, res) {
    logger.debug("RestApiInfo get");

    let target = req.params.target;
    let result = {};
    try {
      if (target === "api" || target === "edfapi") {
        result = {
          document_base: config.restapi[target].version,
          document_released_date: config.restapi[target].releaseDate,
        };
      } else if (target === "ems") {
        result = await RestApiInfo.getEmsVersion();
      } else if(target === "pcs") {
        result = await RestApiInfo.getPcsVersion();
      } else if (target === "bms") {
        result = await RestApiInfo.getBmsVersion();
      } else {
        throw {
          response: {
            status: 404,
            msg: "Version info couldn't found.",
          }
        }
      }
      utils.jsonWrapper(res, result);
    } catch (error) {
      rest_common.errorInfo(res, error);
    }
  }

  static getEmsVersion() {
    let result = axios.all(
      [
        axios(rest_common.getOptions(command.IPC_MAP["GetEmsInfo_WB"])),
      ])
      .then(axios.spread((...responses) => {
          let ems_version_info = responses[0].data.payload;
          
          return {
            ems_hw_version: ems_version_info.ems_hw_version,
            ems_hw_model: ems_version_info.ems_model, 
            ems_sw_version: ems_version_info.ems_sw_version,
            ems_build_date: ems_version_info.ems_build_date,
          }
      }))
      .catch(error => {
          throw error;
      })
    
    return result;
  }

  static getPcsVersion() {
    let result = axios.all(
      [
        axios(rest_common.getOptions(command.IPC_MAP["GetESSVersionInfo"])),
      ])
      .then(axios.spread((...responses) => {
          let ess_version_info = responses[0].data.payload;
          
          return {
            pcs_hw_version: ess_version_info.pcs_version.pcs_hw_version,
            pcs_master_fw_version: ess_version_info.pcs_version.pcs_master_fw_version,
            pcs_slave_fw_version: ess_version_info.pcs_version.pcs_slave_fw_version,
          }
      }))
      .catch(error => {
          throw error;
      })
    
    return result;
  }
  
  static getBmsVersion() {
    let result = axios.all(
      [
        axios(rest_common.getOptions(command.IPC_MAP["GetESSVersionInfo"])),
      ])
      .then(axios.spread((...responses) => {
          let ess_version_info = responses[0].data.payload;
          
          return {
            bms_sw_version: [
              ess_version_info.bms_sw_version1,
              ess_version_info.bms_sw_version2,
              ess_version_info.bms_sw_version3,
            ],
          }
      }))
      .catch(error => {
          throw error;
      })
    
    return result;
  }
}

module.exports = RestApiInfo;