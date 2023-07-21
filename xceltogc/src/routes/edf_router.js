'use strict';
const express = require('express');
const router = express.Router();

/* Authentication */
const AUTH = require('../service/auth');

/* EDF WRAPPER */
const EDF_HEART_BEAT = require('../service/wrapper_edf/heart_beat');
const EDF_ALL_DATA = require('../service/wrapper_edf/all_data');
const EDF_METRICS = require('../service/wrapper_edf/metrics');
const EDF_STATE = require('../service/wrapper_edf/state');
const EDF_CONFIG = require('../service/wrapper_edf/config');
const EDF_DIAGNOSTIC = require('../service/wrapper_edf/diagnostic');
const EDF_STATISTICS = require('../service/wrapper_edf/statistics');
const EDF_PARAMETERS = require('../service/wrapper_edf/parameters');
const EDF_POWER_REQUEST = require('../service/wrapper_edf/power_request');
const EDF_BATTERY_PACK_QUANTITY = require('../service/wrapper_edf/battery_pack_quantity');
const EDF_ENERGY_DATA = require('../service/wrapper_edf/energy_data');
const EDF_COMMISSIONING = require('../service/wrapper_edf/commissioning');

router.post('/heartbeat', AUTH.authenticate, EDF_HEART_BEAT.setParameter);
router.get('/alldata', AUTH.authenticate, EDF_ALL_DATA.getPayload);
router.get('/metrics', AUTH.authenticate, EDF_METRICS.getPayload);
router.get('/state', AUTH.authenticate, EDF_STATE.getPayload);
router.get('/config', AUTH.authenticate, EDF_CONFIG.getPayload);
router.get('/diagnostic', AUTH.authenticate, EDF_DIAGNOSTIC.getPayload);
router.get('/statistics', AUTH.authenticate, EDF_STATISTICS.getPayload);
router.get('/parameters', AUTH.authenticate, EDF_PARAMETERS.getPayload);
router.post('/powerrequest', AUTH.authenticate, EDF_POWER_REQUEST.setParameter);
router.post('/batterypackquantity', AUTH.authenticate, EDF_BATTERY_PACK_QUANTITY.setParameter);
router.post('/energydata', AUTH.authenticate, EDF_ENERGY_DATA.setParameter);
router.get('/commissioning', AUTH.authenticate, EDF_COMMISSIONING.getPayload);

module.exports = router;