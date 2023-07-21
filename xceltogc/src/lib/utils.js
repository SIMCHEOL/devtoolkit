/**
 * @author: Cheol Sim
 * @description: common method(as library) on this project.
 */

'use strict'
const config = require('../config/config');
const constants = require('./constants');
const log4js = require('./logger');

const logger = log4js.getLogger();

/**
 * 
 * @param {Response} res 
 * @param {*} payload 
 */
function jsonWrapper(res, payload) {
    let current_date_time = timestamp()
    res.json({
        meta: {
            datetime: current_date_time
        },
        payload: payload
    });
}

/**
 * 
 * @param {*} obj
 */
function isJson(obj) {
    try {
        if(typeof obj === "string") {
            return (typeof JSON.parse(obj) === 'object');
        } else {
            return (typeof JSON.stringify(obj) === 'string');
        }
    } catch (e) {
        return false;
    }
}

/**
 * 
 * @param {Date} date
 */
 function timestamp(date) {
    if (!(date instanceof Date)) {
        date = new Date();
        logger.debug("Get new timestamp");
    }
    let year = date.getFullYear();
    let month = "0" + (date.getMonth()+1);
    let day = "0" + date.getDate();
    let hour = "0" + date.getHours();
    let minute = "0" + date.getMinutes();
    let second = "0" + date.getSeconds();
    return year + "-" + month.slice(-2) + "-" + day.slice(-2) + " " + hour.slice(-2) + ":" + minute.slice(-2) + ":" + second.slice(-2);
}

/**
 * 
 * @param {string} token
 */
function timestamp_expired(token) {
    let date;
    
    try {
        let unix_time = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8')).exp;
        date = new Date(unix_time * 1000);
    } catch (e) {
        logger.fatal("unix time is wrong. I'll return expired time by 30 minute after current time.");
        date = new Date();
    }

    return timestamp(date);
}

// float type check function

/**
 * 
 * @param {Number} value Value to be rounded.
 * @param {Number} pos round position.
 * @returns Value rounded to a certain number of digits. 
 */
function round(value, pos = 0) {
    if(pos < 0 || typeof pos !== "number") pos = 0;
    let fixed = Math.pow(10, pos);
    value = +String(value);
    return Math.round(value * fixed) / fixed;
}

/**
 * 
 * @param {Array} array Values are to be checked as isNaN.
 * @returns If array includes NaN, then return true. 
 */
function checkIsNaN(...array) {
    return array.findIndex(el => isNaN(el)) > -1 ? true : false;
}

/**
 * @param {String} ems_serial_number
 * @returns capacity for PCS
 */
function getEssCapacity(ems_serial_number) {
    let serial = String(ems_serial_number);
    if(serial.length != constants.EMS_SERIAL_NUMBER_LENGTH) {
        return -1;
    }

    let cap = 0;
    try {
        cap = +(serial.substring(7, 11));
        cap = (cap / 10) * Math.pow(10, cap % 10);
    } catch (e) {
        logger.fatal("ESS Capacity couldm't be calculated from EMS Serial number.");
        return -1;
    }

    return cap;
}

module.exports = { 
    jsonWrapper,
    isJson,
    timestamp,
    timestamp_expired,
    round,
    checkIsNaN,
    getEssCapacity,
};