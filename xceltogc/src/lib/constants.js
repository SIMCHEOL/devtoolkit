module.exports = {
    ISSUER: "QCELLS",
    AUTH_KEY: "auth_key",
    AUTH_SECRET: "auth_secret",
    ACCESS_TOKEN: "access_token",
    EXPIRED_AT: "30d",

    X_ACCESS_TOKEN: "x-access-token",
    AUTHORIZATION: "authorization",

    account: {
        "qcells-admin": {
            secret_key: "VVVORlRFeFRYMFZOVTE5U1JWTlVRVkJKWDBGRVRVbE8=",
            privilege: 5
        },
        "qcells-tas": {
            secret_key: "VVVORlRFeFRYMFZOVTE5U1JWTlVRVkJKWDFSQlV3PT0=",
            privilege: 4
        },
        "qcells-mass": {
            secret_key: "VVVORlRFeFRYMFZOVTE5U1JWTlVRVkJKWDAxQlUxTT0=",
            privilege: 4
        },
        "qcells-common": {
            secret_key: "VVVORlRFeFRYMFZOVTE5U1JWTlVRVkJKWDBOUFRVMVBUZz09",
            privilege: 3
        },
        "edf-enr": {
            secret_key: "VVVORlRFeFRYMFZOVTE5U1JWTlVRVkJKWDBWRVJsOUZUbEk9",
            privilege: 1
        },
        "qcells-authorization": {
            secret_key: "VVVORlRFeFRYMFZOVTE5U1JWTlVRVkJKWDBSRlZrVk1UMUJOUlU1VQ==",
            privilege: 1
        },
    },
    PRIVILEGE_SETNVM: 4,

    /** Common Message */
    NEED_AUTHENTIFICATION: "Authentication required.",
    NEED_SECRET_KEY: "[QCELLS]secretOrPrivateKey must have a value",

    /** ERROR Object */
    CAN_NOT_FIND_IPC: {
        msg: "Can not find IPC, Please check URI or API Name.",
        response: {
            status: 500
        }
    },
    NEED_CORRECT_PARAMETER: {
        msg: "This API need correct parameters.",
        response: {
            status: 500
        }
    },
    NEED_IMPLEMENTATION: {
        msg: "Need to implement API.",
        response: {
            status: 501
        }
    },
    ERROR_IPC_COMMUNICATION: {
        msg: "Fail to communicate for EMS.",
        response: {
            status: 500
        }
    },
    /**
     * This constant is catched error for ERROR_IPC_COMMUNICATION
     */
    ERROR_IPC_COMMUNICATION_CATCH: {
        error_code: "0x000EC0DE"
    },
    ERROR_SETTING_TIMEZONE: {
        msg: "Fail to set timezone.",
        response: {
            status: 500
        }
    },
    ERROR_NOT_ENOUGH_EMS_MEMORY: {
        msg: "EMS memory can't be allocated for updating.",
        response: {
            status: 413
        }
    },
    ERROR_FAIL_TO_UPDATE_FILE: {
        msg: "Fail to EMS Update during Update file have moving.",
        response: {
            status: 500
        }
    },

    // Common Define Variables
    EMS_SERIAL_NUMBER_LENGTH: 18,
    PVES_ESS_CAPACITY_1: 7600,
    PVES_ESS_CAPACITY_2: 11400,

    IPC_RESPONSE_CODE_SUCCESS: parseInt('0x00000000', 16),
    EMS_STATE_IDLE: parseInt('0x00000000', 16),
    EMS_STATE_DOWNLOAD_CM: parseInt('0x00000001', 16),
    EMS_STATE_DOWNLOAD_WE: parseInt('0x00000002', 16),

    FW_INFO_NONE: 0,
    FW_INFO_EMS: 1,
    FW_INFO_PCS: 2,
    FW_INFO_BMS: 4,
    FW_INFO_BDC: 8,
    FW_INFO_EMS_APP: 16,
    FW_INFO_AFCI: 32,
    FW_INFO_OPT: 64,
    FW_INFO_HUB: 128,
    FW_INFO_ALL: 255,

    PHASE: {
        "R-S": 0,
        "R-N": 1,
        "S-N": 2,
        "T-N": 3,
    },

    RACK_ID_MAX: 3,

    CALIBRATION_ITEM: {
        AC: {
            INV_CURRENT:    0b00000001,
            INV_VOLTAGE:    0b00000010,
            GRID_CURRENT:   0b00000100,
            GRID_VOLTAGE:   0b00001000,
            LOAD_CURRENT:   0b00010000,
            LOAD_VOLTAGE:   0b00100000,
            EXT_CT_CURRENT: 0b01000000,
            RCMU_CURRENT:   0b10000000,
        },
        DC: {
            PV_CURRENT_0:  0b00000001,
            PV_VOLTAGE_0:  0b00000010,
            PV_CURRENT_1:  0b00000100,
            PV_VOLTAGE_1:  0b00001000,
            PV_CURRENT_2:  0b00010000,
            PV_VOLTAGE_2:  0b00100000,
            DCL_VOLTAGE:   0b01000000,
            BDC_VOLTAGE:   0b10000000,
            BDC_CURRENT_0: 0b00000001,
            BDC_CURRENT_1: 0b00000010,
        },
        BDC: {
            BDC2_CURR:    0b00000001,
            BDC1_CURR:    0b00000010,
            BDC_VOLT:     0b00000100,
            BAT_VOLT:     0b00001000,
            DC_LINK_VOLT: 0b00010000,
        },
        AFCI: {
            DC_CURRENT_CH1: 0b00000001,
            DC_CURRENT_CH2: 0b00000010,
            DC_CURRENT_CH3: 0b00000100,
            AC_CURRENT_CH1: 0b00010000,
            AC_CURRENT_CH2: 0b00100000,
            AC_CURRENT_CH3: 0b01000000,
        },
        HUB: {

        }
    },
}