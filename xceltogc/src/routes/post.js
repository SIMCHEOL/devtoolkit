'use strict';
const express = require('express');
const router = express.Router();

/* Authentication */
const AUTH = require('../service/auth');

// Services
const bypass = require('../service/bypass');
const logger = require('../service/logger');
const update = require('../service/update');
const EMS_CONFIG = require('../service/ems/config');
const EMS_COMMAND = require('../service/ems/command');
const EMS_CALIBRATION_POST = require('../service/ems/calibration_post');

/* POST Routers. */
router.post('/auth/token', AUTH.getToken);
router.post('/ems/config', AUTH.authenticate, EMS_CONFIG.setItem);
router.post('/ems/config/grid-code/:grid_code', AUTH.authenticate, EMS_CONFIG.setGridCode);
router.post('/ems/command/:command', AUTH.authenticate, EMS_COMMAND.sendIpc);
router.post('/ems/calibration/ac/:phase', AUTH.authenticate, EMS_CALIBRATION_POST.setCalibrationAc);
router.post('/ems/calibration/dc', AUTH.authenticate, EMS_CALIBRATION_POST.setCalibrationDc);
router.post('/ems/calibration/afci', AUTH.authenticate, EMS_CALIBRATION_POST.setCalibrationAfci);
router.post('/ems/calibration/bdc/:rack_id', AUTH.authenticate, EMS_CALIBRATION_POST.setCalibrationBdc);

/* POST Routers for Admin. */
router.post('/ipc/:ipc', AUTH.authenticate, AUTH.checkPrivilege, bypass.get);
router.post('/loglevel', AUTH.authenticate, AUTH.checkPrivilege, logger.set);
router.post('/update/manual', AUTH.authenticate, AUTH.checkPrivilege, update.updateEmsManual);

module.exports = router;
