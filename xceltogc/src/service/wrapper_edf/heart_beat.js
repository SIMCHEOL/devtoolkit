'use strict';
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const constants = require('../../lib/constants');
const edf_constants = require('./edf_constants');

const logger = log4js.getLogger();

class EDF_HEART_BEAT {
    static setParameter(req, res, next) {
        logger.debug("EDF_HEART_BEAT setParameter");
        let heart_beat = parseInt(req.body.stk_Heartbeat, 10);

        if(!rest_common.validateParameter(req.body.stk_Heartbeat) || 
            utils.checkIsNaN(heart_beat)) {
            rest_common.errorInfo(res, constants.NEED_CORRECT_PARAMETER);
            return;
        }
        
        let SetHeartBeat_WB = axios(rest_common.getOptions(command.IPC_MAP["SetHeartBeat_WB"], 
        {
            heart_beat: heart_beat,
        }
        ));
        
        axios.all(
            [
                SetHeartBeat_WB,
            ]
        ).then(axios.spread((...responses) => {
            let set_heart_beat = responses[0].data;

            if(parseInt(set_heart_beat.error_code, 16)) {
                logger.fatal(responses[0]);
                throw constants.ERROR_IPC_COMMUNICATION;
            }
            
            utils.jsonWrapper(res);
        }))
        .catch(error => {
            rest_common.errorInfo(res, error);
        })
    }

    static async getPayload(req, res, next) {
        try {
            let result = await EDF_HEART_BEAT.getData();
            utils.jsonWrapper(res, result);
        } catch (error) {
            rest_common.errorInfo(res, error);
        }
    }

    static getData() {
        logger.debug("EDF_METRICS.getData()");

        let GetHeartBeat_WB = axios(rest_common.getOptions(command.IPC_MAP["GetHeartBeat_WB"]));

        let result = axios.all(
            [
                GetHeartBeat_WB,
            ]
        ).then(axios.spread((...responses) => {
            let heart_beat = responses[0].data.payload.heart_beat;
            return {
                stk_Heartbeat: heart_beat,
            }
        }))
        .catch(error => {
            throw error;
        })

        return result;
    }
}


module.exports = EDF_HEART_BEAT;