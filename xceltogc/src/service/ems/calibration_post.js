'use strict';
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const config = require('../../src/config/config');
const constants = require('../../lib/constants');

const logger = log4js.getLogger();
class EmsCalibrationSet {
    static async setCalibrationAc(req, res) {
        logger.debug("setCalibrationAc");
        if(!(String(req.params.phase).toUpperCase() in constants.PHASE)) {
            rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
            return;
        }

        const phase = constants.PHASE[String(req.params.phase).toUpperCase()];
        let data = req.body;
        let can_data = [ 0b00000000, 0b00000000, 0b00000000, 0b00000000, 0b00000000, 0b00000000 ];
        let ref_ac = { };

        // Initialize all in calibration keys
        for(let key in constants.CALIBRATION_ITEM.AC) {
            ref_ac[key.toLowerCase()] = 0;
        }

        for(let o in data) {
            if(!(o.toUpperCase() in constants.CALIBRATION_ITEM.AC)) {
                logger.debug("[setCalibrationAc] object key is not in AC.");
                rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
                return;
            }
            if(!("ref" in data[o]) || !("gain" in data[o]) || !("offset" in data[o])) {
                logger.debug("[setCalibrationAc] ref or gain or offset is not exists in parameter.");
                rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
                return;
            }
            if(data[o].gain === 1 && data[o].offset === 1) {
                logger.debug("[setCalibrationAc] gain and offset value are 1 at same time.");
                rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
                return;
            }

            ref_ac[o.toLowerCase()] = data[o].ref;
            if(data[o].gain === 1) {
                can_data[0] |= constants.CALIBRATION_ITEM.AC[o.toUpperCase()];
            }
            if(data[o].offset === 1) {
                can_data[3] |= constants.CALIBRATION_ITEM.AC[o.toUpperCase()];
            }
        }

        const payload = {
            phase_type: phase,
            reference: {
                ref_ac: ref_ac,
            },
            commands: can_data,
        }

        logger.debug("[setCalibrationAc:payload]", payload);

        let result = await axios(rest_common.getOptions(command.IPC_MAP["SetPCSCalibrationAcData"], payload, 30 * 1000))
        .then(resp => {
          return resp.data;
        })
        .catch(error => {
          logger.fatal(error);
          return constants.ERROR_IPC_COMMUNICATION_CATCH;
        })

        if (result === null) {
            rest_common.errorInfo(res, constants.CAN_NOT_FIND_IPC);
        } else if(typeof result === "undefined" || parseInt(result.error_code, 16)) {
            let res_error = JSON.parse(JSON.stringify(constants.ERROR_IPC_COMMUNICATION));
            res_error.response.error_code = result.error_code;
            rest_common.errorInfo(res, res_error);
        } else {
            if(typeof result.payload === "undefined") {
                result.payload = {};
            }
            result.payload.error_code = result.error_code;
            utils.jsonWrapper(res, result.payload);
        }
    }

    static async setCalibrationDc(req, res) {
        logger.debug("setCalibrationDc");
        let data = req.body;
        let can_data = [ 0b00000000, 0b00000000, 0b00000000, 0b00000000, 0b00000000, 0b00000000 ];
        let pv_voltage_ref = [ 0, 0, 0 ];
        let pv_current_ref = [ 0, 0, 0 ];
        let dcl_voltage_ref = 0;
        let bdc_voltage_ref = 0;
        let bdc_current_ref = [ 0, 0 ];

        for(let o in data) {
            if(!(o.toUpperCase() in constants.CALIBRATION_ITEM.DC)) {
                logger.debug("[setCalibrationDc] object key is not in DC.");
                rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
                return;
            }
            if(!("ref" in data[o]) || !("gain" in data[o]) || !("offset" in data[o])) {
                logger.debug("[setCalibrationDc] ref or gain or offset is not exists in parameter.");
                rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
                return;
            }
            if(data[o].gain === 1 && data[o].offset === 1) {
                logger.debug("[setCalibrationDc] gain and offset value are 1 at same time.");
                rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
                return;
            }

            if(o.toUpperCase().indexOf("BDC_VOLTAGE") !== -1) {
                bdc_voltage_ref = data[o].ref;
            }

            if(o.toUpperCase().indexOf("DCL_VOLTAGE") !== -1) {
                dcl_voltage_ref = data[o].ref;
            }

            if(o.toUpperCase().indexOf("PV_VOLTAGE_") !== -1) {
                pv_voltage_ref[parseInt(o.substring(o.length-1, o.length))] = data[o].ref;
            }

            if(o.toUpperCase().indexOf("PV_CURRENT_") !== -1) {
                pv_current_ref[parseInt(o.substring(o.length-1, o.length))] = data[o].ref;
            }

            if(o.toUpperCase().indexOf("BDC_CURRENT_") !== -1) {
                bdc_current_ref[parseInt(o.substring(o.length-1, o.length))] = data[o].ref;
            }

            if(data[o].gain === 1) {
                if(o.toUpperCase().indexOf("BDC_CURRENT_") !== -1) {
                    can_data[1] |= constants.CALIBRATION_ITEM.DC[o.toUpperCase()];
                } else {
                    can_data[0] |= constants.CALIBRATION_ITEM.DC[o.toUpperCase()];
                }
            }
            if(data[o].offset === 1) {
                if(o.toUpperCase().indexOf("BDC_CURRENT_") !== -1) {
                    can_data[4] |= constants.CALIBRATION_ITEM.DC[o.toUpperCase()];
                } else {
                    can_data[3] |= constants.CALIBRATION_ITEM.DC[o.toUpperCase()];
                }
            }
        }

        const payload = {
            commands: can_data,
            reference: {
                ref_pv: {
                    pv_voltage: pv_voltage_ref,
                    pv_current: pv_current_ref,
                    dcl_voltage: dcl_voltage_ref,
                },
                ref_bdc: {
                    bdc_voltage: bdc_voltage_ref,
                    bdc_current: bdc_current_ref,
                },
            }
        }

        logger.debug("[setCalibrationDc:payload]", payload);

        let result = await axios(rest_common.getOptions(command.IPC_MAP["SetPCSCalibrationDcData"], payload, 30 * 1000))
        .then(resp => {
          return resp.data;
        })
        .catch(error => {
          logger.fatal(error);
          return constants.ERROR_IPC_COMMUNICATION_CATCH;
        })

        if (result === null) {
            rest_common.errorInfo(res, constants.CAN_NOT_FIND_IPC);
        } else if(typeof result === "undefined" || parseInt(result.error_code, 16)) {
            let res_error = JSON.parse(JSON.stringify(constants.ERROR_IPC_COMMUNICATION));
            res_error.response.error_code = result.error_code;
            rest_common.errorInfo(res, res_error);
        } else {
            if(typeof result.payload === "undefined") {
                result.payload = {};
            }
            result.payload.error_code = result.error_code;
            utils.jsonWrapper(res, result.payload);
        }
    }

    static async setCalibrationAfci(req, res) {
        logger.debug("setCalibrationAfci");
        let data = req.body;
        let can_data = [ 0b00000000, 0b00000000, 0b00000000, 0b00000000, 0b00000000, 0b00000000 ];
        let dc_current_ref = [ 0, 0, 0 ];

        for(let o in data) {
            if(!(o.toUpperCase() in constants.CALIBRATION_ITEM.AFCI)) {
                logger.debug("[setCalibrationAfci] object key is not in AFCI.");
                rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
                return;
            }
            if(!("ref" in data[o]) || !("gain" in data[o]) || !("offset" in data[o])) {
                logger.debug("[setCalibrationAfci] ref or gain or offset is not exists in parameter.");
                rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
                return;
            }            
            if(data[o].gain === 1 && data[o].offset === 1) {
                logger.debug("[setCalibrationAfci] gain and offset value are 1 at same time.");
                rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
                return;
            }

            if(o.toUpperCase().indexOf("DC_CURRENT_") !== -1) {
                dc_current_ref[parseInt(o.substring(o.length-1, o.length))] = data[o].ref;
            }

            if(o.toUpperCase().indexOf("AC_CURRENT_") !== -1) {
                data[o].gain = 0;
            }

            if(data[o].gain === 1) {
                can_data[0] |= constants.CALIBRATION_ITEM.AFCI[o.toUpperCase()];
            }
            if(data[o].offset === 1) {
                can_data[3] |= constants.CALIBRATION_ITEM.AFCI[o.toUpperCase()];
            }
        }

        const payload = {
            commands: can_data,
            reference: {
                dc_current_ref: dc_current_ref,
            },
        }

        logger.debug("[setCalibrationAfci:payload]", payload);

        let result = await axios(rest_common.getOptions(command.IPC_MAP["SetAFCICalibrationData"], payload, 30 * 1000))
        .then(resp => {
          return resp.data;
        })
        .catch(error => {
          logger.fatal(error);
          return constants.ERROR_IPC_COMMUNICATION_CATCH;
        })

        if (result === null) {
            rest_common.errorInfo(res, constants.CAN_NOT_FIND_IPC);
        } else if(typeof result === "undefined" || parseInt(result.error_code, 16)) {
            let res_error = JSON.parse(JSON.stringify(constants.ERROR_IPC_COMMUNICATION));
            res_error.response.error_code = result.error_code;
            rest_common.errorInfo(res, res_error);
        } else {
            if(typeof result.payload === "undefined") {
                result.payload = {};
            }
            result.payload.error_code = result.error_code;
            utils.jsonWrapper(res, result.payload);
        }
    }

    static async setCalibrationBdc(req, res) {
        logger.debug("setCalibrationBdc");
        if(parseInt(req.params.rack_id, 10) > constants.RACK_ID_MAX) {
            rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
            return;
        }

        let data = req.body;
        let can_data = [ 0b00000000, 0b00000000, 0b00000000, 0b00000000, 0b00000000, 0b00000000 ];
        let ref_bdc = { };
        let rack_id = parseInt(req.params.rack_id, 10);

        // Initialize all in calibration keys
        for(let key in constants.CALIBRATION_ITEM.BDC) {
            ref_bdc[key.toLowerCase()] = 0;
        }

        for(let o in data) {
            if(!(o.toUpperCase() in constants.CALIBRATION_ITEM.BDC)) {
                logger.debug("[setCalibrationBdc] object key is not in BDC.");
                rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
                return;
            }
            if(!("ref" in data[o]) || !("gain" in data[o]) || !("offset" in data[o])) {
                logger.debug("[setCalibrationBdc] ref or gain or offset is not exists in parameter.");
                rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
                return;
            }            
            if(data[o].gain === 1 && data[o].offset === 1) {
                logger.debug("[setCalibrationBdc] gain and offset value are 1 at same time.");
                rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
                return;
            }

            ref_ac[o.toLowerCase()] = data[o].ref;
            if(data[o].gain === 1) {
                can_data[0] |= constants.CALIBRATION_ITEM.BDC[o.toUpperCase()];
            }
            if(data[o].offset === 1) {
                can_data[3] |= constants.CALIBRATION_ITEM.BDC[o.toUpperCase()];
            }
        }

        const payload = {
            commands: can_data,
            reference: ref_bdc,
            rackId: rack_id,
        }

        logger.debug("[setCalibrationBdc:payload]", payload);

        let result = await axios(rest_common.getOptions(command.IPC_MAP["SetBDCCalibrationData"], payload, 30 * 1000))
        .then(resp => {
          return resp.data;
        })
        .catch(error => {
          logger.fatal(error);
          return constants.ERROR_IPC_COMMUNICATION_CATCH;
        })

        if (result === null) {
            rest_common.errorInfo(res, constants.CAN_NOT_FIND_IPC);
        } else if(typeof result === "undefined" || parseInt(result.error_code, 16)) {
            let res_error = JSON.parse(JSON.stringify(constants.ERROR_IPC_COMMUNICATION));
            res_error.response.error_code = result.error_code;
            rest_common.errorInfo(res, res_error);
        } else {
            if(typeof result.payload === "undefined") {
                result.payload = {};
            }
            result.payload.error_code = result.error_code;
            utils.jsonWrapper(res, result.payload);
        }
    }
}

module.exports = EmsCalibrationSet;