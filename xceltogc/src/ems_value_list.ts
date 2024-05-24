import { EmsDefaultValue } from './GridCode';

const EMS_DEFAULT_VALUE_LIST: EmsDefaultValue[] = [
    {
        grid_code: 276, country_code: 276, timezone: "Europe/Berlin",
        language_code: 5, sftp_address: "3.124.225.92", feed_in_limit: 100,
    },
    {
        grid_code: 361, country_code: 36, timezone: "Australia/Sydney",
        language_code: 1, sftp_address: "52.64.248.53", feed_in_limit: 100,
    },
    {
        grid_code: 362, country_code: 36, timezone: "Australia/Sydney",
        language_code: 1, sftp_address: "52.64.248.53", feed_in_limit: 100,
    },
    {
        grid_code: 363, country_code: 36, timezone: "Australia/Sydney",
        language_code: 1, sftp_address: "52.64.248.53", feed_in_limit: 100,
    },
    {
        grid_code: 554, country_code: 554, timezone: "Pacific/Auckland",
        language_code: 1, sftp_address: "52.64.248.53", feed_in_limit: 100,
    },
    {
        grid_code: 2501, country_code: 250, timezone: "Europe/Paris",
        language_code: 4, sftp_address: "3.124.225.92", feed_in_limit: 100,
    },
    {
        grid_code: 2502, country_code: 250, timezone: "Europe/Paris",
        language_code: 4, sftp_address: "3.124.225.92", feed_in_limit: 100,
    },
    {
        grid_code: 2503, country_code: 250, timezone: "Europe/Paris",
        language_code: 4, sftp_address: "3.124.225.92", feed_in_limit: 100,
    },
    {
        grid_code: 2504, country_code: 250, timezone: "Europe/Paris",
        language_code: 4, sftp_address: "3.124.225.92", feed_in_limit: 100,
    },
    {
        grid_code: 2506, country_code: 250, timezone: "Europe/Paris",
        language_code: 4, sftp_address: "3.124.225.92", feed_in_limit: 100,
    },
    {
        grid_code: 2507, country_code: 250, timezone: "Europe/Paris",
        language_code: 4, sftp_address: "3.124.225.92", feed_in_limit: 100,
    },
    {
        grid_code: 826, country_code: 826, timezone: "Europe/London",
        language_code: 1, sftp_address: "3.124.225.92", feed_in_limit: 100,
    },
    {
        grid_code: 6201, country_code: 620, timezone: "Europe/Lisbon",
        language_code: 8, sftp_address: "3.124.225.92", feed_in_limit: 100,
    },
    {
        grid_code: 6202, country_code: 620, timezone: "Europe/Lisbon",
        language_code: 8, sftp_address: "3.124.225.92", feed_in_limit: 100,
    },
    {
        grid_code: 8262, country_code: 826, timezone: "Europe/London",
        language_code: 1, sftp_address: "3.124.225.92", feed_in_limit: 100,
    },
    {
        grid_code: 372, country_code: 372, timezone: "Europe/Dublin",
        language_code: 1, sftp_address: "3.124.225.92", feed_in_limit: 100,
    },
    {
        grid_code: 901, country_code: 276, timezone: "Europe/Berlin",
        language_code: 5, sftp_address: "3.124.225.92", feed_in_limit: 100,
    },
    {
        grid_code: 410, country_code: 410, timezone: "Asia/Seoul",
        language_code: 1, sftp_address: "", feed_in_limit: 100,
    },
    {
        grid_code: 704, country_code: 704, timezone: "Asia/Ho_Chi_Minh",
        language_code: 1, sftp_address: "", feed_in_limit: 100,
    },
    {
        grid_code: 8401, country_code: 840, timezone: "America/New_York",
        language_code: 1, sftp_address: "", feed_in_limit: 100,
    },
    {
        grid_code: 8402, country_code: 840, timezone: "America/New_York",
        language_code: 1, sftp_address: "", feed_in_limit: 100,
    },
    {
        grid_code: 8403, country_code: 840, timezone: "America/New_York",
        language_code: 1, sftp_address: "", feed_in_limit: 100,
    },
    {
        grid_code: 8404, country_code: 840, timezone: "America/New_York",
        language_code: 1, sftp_address: "", feed_in_limit: 100,
    },
    {
        grid_code: 8406, country_code: 840, timezone: "America/New_York",
        language_code: 1, sftp_address: "", feed_in_limit: 100,
    },
    {
        grid_code: 8451, country_code: 840, timezone: "America/New_York",
        language_code: 1, sftp_address: "", feed_in_limit: 100,
    },
    {
        grid_code: 8452, country_code: 840, timezone: "America/New_York",
        language_code: 1, sftp_address: "", feed_in_limit: 100,
    },
    {
        grid_code: 8453, country_code: 840, timezone: "America/New_York",
        language_code: 1, sftp_address: "", feed_in_limit: 100,
    },
    {
        grid_code: 8454, country_code: 840, timezone: "America/New_York",
        language_code: 1, sftp_address: "", feed_in_limit: 100,
    },
    {
        grid_code: 8455, country_code: 840, timezone: "America/New_York",
        language_code: 1, sftp_address: "", feed_in_limit: 100,
    },
]

function getEmsDefaultValue(gc: number) {
    for(let o of EMS_DEFAULT_VALUE_LIST) {
        if(gc === o.grid_code) {
            return o;
        }
    }
    return EMS_DEFAULT_VALUE_LIST[0];
}

/* 
 *  getAdditionalValues() is called after grid code settings.
 *  This values are depend on partial grid code. so, this values will be added at last in JSON file.
 */
const EDF_ENR_GATEWAY_CONN = 3;
function getAdditionalValues(result: any) {
    if(result.grid_code == 901) {
        result["pcs_connection_mode"] = "1";
        result["pcs_conn"] = "3";
        result["meter_model"] = "0";
        result["meter_model_pv"] = "0";
    } else if (result.grid_code == 2506) {
        result["gateway_conn"] = EDF_ENR_GATEWAY_CONN;
        result["installed_rack_count"] = "1";
        result["meter_load_from_gw"] = "1";
        result["meter_load_from_gw_pv"] = "1";
        result["install_done"] = "1";
    }  else if (8401 <= result.grid_code && result.grid_code <= 8499) {
        result["meter_model"] = "0";
        result["meter_model_pv"] = "0";
    } else {
        console.log("Just passed.");
    }
}

export {
    getEmsDefaultValue,
    getAdditionalValues,
}