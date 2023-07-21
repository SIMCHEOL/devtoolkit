'use strict';
const express = require('express');
const router = express.Router();

/* Authentication */
const AUTH = require('../service/auth');

// Services
const VERSION_INFO = require('../service/version_info');
const EMS_CONFIG = require('../service/ems/config');
const EMS_COMMAND = require('../service/ems/command');
const EMS_CALIBRATION_GET = require('../service/ems/calibration_get');
const bypass = require('../service/bypass');
const logger = require('../service/logger');

/* GET Routers. */
router.get('/version/:target', VERSION_INFO.getVersion);
router.get('/ems/config', EMS_CONFIG.getAllItems);
router.get('/ems/config/:db_item', EMS_CONFIG.getItem);
router.get('/ems/command/:command', AUTH.authenticate, EMS_COMMAND.sendIpc);
router.get('/ems/calibration/:device', AUTH.authenticate, EMS_CALIBRATION_GET.getCalibrationCommon);
router.get('/ems/calibration/ac/:phase', AUTH.authenticate, EMS_CALIBRATION_GET.getCalibrationAc);
router.get('/ems/calibration/bdc/:rack_id', AUTH.authenticate, EMS_CALIBRATION_GET.getCalibrationBdc);

/* GET Routers for IPC Bypass. */
router.get('/ipc/:ipc', AUTH.authenticate, bypass.get);
router.get('/loglevel', AUTH.authenticate, AUTH.checkPrivilege, logger.test);

module.exports = router;
