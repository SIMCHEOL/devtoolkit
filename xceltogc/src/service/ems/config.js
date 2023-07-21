'use strict';
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const config = require('../../config/config');
const db_items = require('./db_items');
const locales = require('./locales.json');
const constants = require('../../lib/constants');

const logger = log4js.getLogger();

class EmsConfig {
  static async getAllItems(req, res) {
    logger.debug("getAllItems");
    let all_item = db_items.map(el => { return {name: el} });

    await axios.all(
      [
        axios(rest_common.getOptions(command.IPC_MAP["GetNVM"], { nv_items: all_item })),
      ])
      .then(axios.spread((...responses) => {
        utils.jsonWrapper(res, responses[0].data.payload);
      }))
      .catch(error => {
        rest_common.errorInfo(res, error);
      })
  }

  static async getItem(req, res) {
    logger.debug("getItem");
    let db_item = req.params.db_item;
    let hasNotKey = false;
    hasNotKey = typeof db_items.find(el => el === db_item) === "undefined";

    if(hasNotKey) {
      rest_common.errorInfo(res, {
        response: {
          status: 404,
          msg: "DB Item not found.",
        }
      });
      return;
    }
    await axios.all(
      [
        axios(rest_common.getOptions(command.IPC_MAP["GetNVM"], { nv_items: [{name: db_item}] })),
      ])
      .then(axios.spread((...responses) => {
        utils.jsonWrapper(res, responses[0].data.payload);
      }))
      .catch(error => {
        rest_common.errorInfo(res, error);
      })
  }

  static async setItem(req, res) {
    logger.debug("setItem");

    await axios.all(
      [
        axios(rest_common.getOptions(command.IPC_MAP["SetNVM"], { nv_items: req.body })),
      ])
      .then(axios.spread((...responses) => {
        utils.jsonWrapper(res, responses[0].data.payload);
      }))
      .catch(error => {
        rest_common.errorInfo(res, error);
      })
  }

  static async setGridCode(req, res) {
    logger.debug("setGridCode");
    let grid_code = req.params.grid_code;
    let country_code = 0, advanced_setting = null, made_nvm = [];

    for(let cc in locales) {
      for(let gc in locales[cc].grid_code) {
        if(grid_code == locales[cc].grid_code[gc]) {
          country_code = locales[cc].country_code;
        }
      }
    }

    if(country_code === 0) {
      rest_common.errorInfo(res, "Country about grid code can't be found.");
      return;
    }

    /** (PVES Product) USA Grid Code only */
    if(8401 <= parseInt(grid_code, 10) && parseInt(grid_code, 10) <= 8410) {
      let ems_serial_number = await axios.all(
        [
          axios(rest_common.getOptions(command.IPC_MAP["GetNVM"], { nv_items: [{name:"EMS_serial_number"}] })),
        ])
        .then(axios.spread((...responses) => {
          return responses[0].data.payload;
        }))
        .catch(error => {
          rest_common.errorInfo(res, error);
        })
        
        if(utils.getEssCapacity(ems_serial_number.EMS_serial_number) > constants.PVES_ESS_CAPACITY_1) {
          grid_code = grid_code + "_2"
        } else {
          grid_code = grid_code + "_1"
        }
    }

    advanced_setting = await axios.all(
      [
        axios(rest_common.getOptions(command.IPC_MAP["GetDefaultGridCode_WB"], { grid_code: grid_code })),
      ])
      .then(axios.spread((...responses) => {
        return responses[0].data.payload[0];
      }))
      .catch(error => {
        rest_common.errorInfo(res, error);
      })

    // Timezone would be set through IPC not as nv item.
    let timezone_for_ipc = advanced_setting.timezone;
    delete advanced_setting.timezone;

    for(let key in advanced_setting) {
      made_nvm.push({
        name: key,
        value: ((String(advanced_setting[key]).indexOf('-') > 0) ? String(advanced_setting[key]) : EmsConfig.parseValue(advanced_setting[key])),
      });
    }

    await axios.all(
      [
        axios(rest_common.getOptions(command.IPC_MAP["SetNVM"], { nv_items: made_nvm })),
        axios(rest_common.getOptions(command.IPC_MAP["SetTimeZone"], { timezone: timezone_for_ipc })),
      ])
      .then(axios.spread((...responses) => {
        if(parseInt(responses[0].data.error_code, 16)) {
          throw constants.ERROR_IPC_COMMUNICATION;
        }
        if(parseInt(responses[1].data.error_code, 16)) {
          throw constants.ERROR_SETTING_TIMEZONE;
        }
        
        utils.jsonWrapper(res, responses[0].data);
      }))
      .catch(error => {
        logger.fatal(error);
        rest_common.errorInfo(res, error);
      })
      
  }

  static parseValue(val) {
    if (String(val).toUpperCase() == 'NULL') {
      return null;
    } else if (String(val).split('.').length > 2) {
      return String(val);
    } else if (String(val).substring(0, 2).toUpperCase() == '0X') {
      return String(val);
    } else if (String(val).substring(0, 2).toUpperCase() == '0B') {
      return String(val);
    } else if (!isNaN(parseFloat(val))) {
      return parseFloat(val);
    } else if (!isNaN(parseInt(val))) {
      return parseInt(val);
    } else {
      return String(val);
    }
  }
}

module.exports = EmsConfig;