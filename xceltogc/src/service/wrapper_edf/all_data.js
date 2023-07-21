'use strict';
const axios = require('axios');
const log4js = require('../../lib/logger');
const command = require('../../lib/command');
const rest_common = require('../../lib/rest-common');
const utils = require('../../lib/utils');
const edf_constants = require('./edf_constants');

const EDF_METRICS = require('./metrics');
const EDF_STATE = require('./state');
const EDF_CONFIG = require('./config');
const EDF_DIAGNOSTIC = require('./diagnostic');
const EDF_STATISTICS = require('./statistics');
const EDF_PARAMETERS = require('./parameters');
const EDF_COMMISSIONING = require('./commissioning');

const logger = log4js.getLogger();

class EDF_ALL_DATA {
    static async getPayload(req, res, next) {
        try {
            let result = await EDF_ALL_DATA.getAllData();
            utils.jsonWrapper(res, result);
        } catch (error) {
            rest_common.errorInfo(res, error);
        }
        
    }

    static async getAllData() {
        logger.debug("EDF_ALL_DATA.getAllData()");

        let metrics = EDF_METRICS.getData();
        let state = EDF_STATE.getData();
        let config = EDF_CONFIG.getData();
        let diagnostic = EDF_DIAGNOSTIC.getData();
        let statistics = EDF_STATISTICS.getData();
        let parameters = EDF_PARAMETERS.getData();
        let commissioning = EDF_COMMISSIONING.getData();


        let [
                result_metrics,
                result_state,
                result_config,
                result_diagnostic,
                result_statistics,
                result_parameters,
                result_commissioning,
            ] = await Promise.all([
                        metrics,
                        state,
                        config,
                        diagnostic,
                        statistics,
                        parameters,
                        commissioning,
                    ]);

        return {
            metrics: result_metrics,
            state: result_state,
            config: result_config,
            diagnostic: result_diagnostic,
            statistics: result_statistics,
            parameters: result_parameters,
            commissioning: result_commissioning,
        }
    }
}

module.exports = EDF_ALL_DATA;