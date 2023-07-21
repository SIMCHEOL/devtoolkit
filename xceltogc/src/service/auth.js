'use strict';
const constants = require('../lib/constants');
const log4js = require('../lib/logger');
const config = require('../config/config');
const utils = require('../lib/utils');
const jwt = require('jsonwebtoken')

const logger = log4js.getLogger();

class TokenManager {
    static getToken(req, res) {
        const base_key = (req.body[constants.AUTH_KEY] || '').split(' ')[0] || '';
        const base64auth = (req.body[constants.AUTH_SECRET] || '').split(' ')[0] || '';
        const auth_secret = Buffer.from(constants.account[base_key].secret_key, 'base64').toString('utf8');

        try {
            if(base64auth === auth_secret) {
                let token = jwt.sign(
                    {
                        auth_key : base_key,
                        privilege : constants.account[base_key].privilege
                    },
                    auth_secret,
                    {
                        expiresIn: constants.EXPIRED_AT,
                        issuer: constants.ISSUER
                    },
                )
                let expiredTime = utils.timestamp_expired(token);
                utils.jsonWrapper(res, {
                    access_token: token,
                    expired_at: expiredTime
                })
            } else {
                throw new Error();
            }
        } catch(error) {
            TokenManager.errorAuth(res, error.message);
            return;
        }
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
    static authenticate(req, res, next) {
        try {
            let token = req.headers[constants.X_ACCESS_TOKEN] || req.headers[constants.AUTHORIZATION];

            if(!token) {
                throw new Error("You have not API Token.");
            }
            
            token = token.replace(/^Bearer\s+/, "");
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
            const auth_key = payload.auth_key;
            const decoded = jwt.verify(token, Buffer.from(constants.account[auth_key].secret_key, 'base64').toString('utf8'));
            if(decoded.auth_key === auth_key) {
                next();
            } else {
                throw new Error("Token information is wrong.");
            }
        } catch(error) {
            TokenManager.errorAuth(res, error.message);
            return;
        }
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
     static checkPrivilege(req, res, next) {
        try {
            let token = req.headers[constants.X_ACCESS_TOKEN] || req.headers[constants.AUTHORIZATION];
            token = token.replace(/^Bearer\s+/, "");
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
            const privilege = payload.privilege;
            logger.info("Privilege :", privilege);
            if(privilege >= constants.PRIVILEGE_SETNVM) {
                next();
            } else {
                throw new Error("You have not privilege for some IPC.");
            }
        } catch(error) {
            TokenManager.errorAuth(res, error.message);
            return;
        }
     }
    
    /**
     * 
     * @param {Response} res 
     * @param {*} error 
     */
    static errorAuth(res, error) {
        res.set('WWW-Authenticate', 'Basic realm="401"');
        res.status(401).json({ 
            msg: "Authentication required.",
            error: error
        });
    }
}

module.exports = TokenManager;