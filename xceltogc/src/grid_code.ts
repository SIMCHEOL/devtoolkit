import { defines, ExtValue } from './constants';

class GridCode {

    /**
     * grid_code
     */
    gc: number;

    /**
     * production (MOW | Q.VOLT)
     */
    pr: number;

    /**
     * capacity
     */
    ca: number;

    /**
     * data column
     */
    dc: string;

    country_code: number;
    timezone: string;
    language_code: number;
    gateway_conn: number;
    sftp_address: string;
    battery_hysteresis_low: number;
    battery_hysteresis_high: number;
    battery_backup_soc: number;
    inverter_import_power_limit: number;
    inverter_export_power_limit: number;
    feed_in_limit: number;

    constructor(grid_code: number, production: number, capacity: number, dc: string) {
        this.gc = grid_code;
        this.pr = production;
        this.ca = capacity;
        this.dc = dc;

        this.country_code = 0;
        this.timezone = "";
        this.language_code = 0;
        this.gateway_conn = 0;
        this.sftp_address = "";
        this.battery_hysteresis_low = 0;
        this.battery_hysteresis_high = 0;
        this.battery_backup_soc = 0;
        this.inverter_import_power_limit = 0;
        this.inverter_export_power_limit = 0;
        this.feed_in_limit = 0;
    }

   public setExtValue(o: ExtValue) {
        this.gc = o.grid_code;
        this.country_code = o.country_code;
        this.timezone = o.timezone;
        this.language_code = o.language_code;
        this.gateway_conn = o.gateway_conn;
        this.sftp_address = o.sftp_address;
        this.battery_hysteresis_low = o.battery_hysteresis_low;
        this.battery_hysteresis_high = o.battery_hysteresis_high;
        this.battery_backup_soc = o.battery_backup_soc;
        this.inverter_import_power_limit = o.inverter_import_power_limit;
        this.inverter_export_power_limit = o.inverter_export_power_limit;
        this.feed_in_limit = o.feed_in_limit;
   }

   public getExtValue(): ExtValue {
       let retObj: ExtValue = {
            grid_code: this.gc,
            country_code: this.country_code,
            timezone: this.timezone,
            language_code: this.language_code,
            gateway_conn: this.gateway_conn,
            sftp_address: this.sftp_address,
            battery_hysteresis_low: this.battery_hysteresis_low,
            battery_hysteresis_high: this.battery_hysteresis_high,
            battery_backup_soc: this.battery_backup_soc,
            inverter_import_power_limit: this.inverter_import_power_limit,
            inverter_export_power_limit: this.inverter_export_power_limit,
            feed_in_limit: this.feed_in_limit,
       }
       return retObj;
   }
}

const GRID_CODE_LIST = [
    new GridCode(276, defines.production_MOW, 4600, "H"),
    new GridCode(361, defines.production_MOW, 5000, "I"),
    new GridCode(362, defines.production_MOW, 5000, "J"),
    new GridCode(363, defines.production_MOW, 5000, "K"),
    new GridCode(554, defines.production_MOW, 5000, "L"),
    new GridCode(2501, defines.production_MOW, 5000, "M"),
    new GridCode(2502, defines.production_MOW, 5000, "N"),
    new GridCode(2503, defines.production_MOW, 5000, "O"),
    new GridCode(2504, defines.production_MOW, 5000, "P"),
    new GridCode(2506, defines.production_MOW, 5000, "R"),
    new GridCode(2507, defines.production_MOW, 5000, "S"),
    new GridCode(826, defines.production_MOW, 5000, "T"),
    new GridCode(8262, defines.production_MOW, 5000, "U"),
    new GridCode(372, defines.production_MOW, 5000, "V"),
    new GridCode(8401, defines.production_PVES, 7600, "K"),
    new GridCode(8401, defines.production_PVES, 11400, "K"),
    new GridCode(8402, defines.production_PVES, 7600, "L"),
    new GridCode(8402, defines.production_PVES, 11400, "L"),
    new GridCode(8403, defines.production_PVES, 7600, "M"),
    new GridCode(8403, defines.production_PVES, 11400, "M"),
    new GridCode(8404, defines.production_PVES, 7600, "N"),
    new GridCode(8404, defines.production_PVES, 11400, "N"),
    new GridCode(8405, defines.production_PVES, 7600, "O"),
    new GridCode(8405, defines.production_PVES, 11400, "O"),
]


const EXT_VALUE_LIST: ExtValue[] = [
    {
        grid_code: 276, country_code: 276, timezone: "Europe/Berlin", language_code: 5, gateway_conn: 0, sftp_address: "3.124.225.92", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 4600, inverter_export_power_limit: 4600, 
        feed_in_limit: 100,
    },
    {
        grid_code: 361, country_code: 36, timezone: "Australia/Sydney", language_code: 3, gateway_conn: 0, sftp_address: "52.64.248.53", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 5000, inverter_export_power_limit: 5000, 
        feed_in_limit: 100,
    },
    {
        grid_code: 362, country_code: 36, timezone: "Australia/Sydney", language_code: 3, gateway_conn: 0, sftp_address: "52.64.248.53", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 5000, inverter_export_power_limit: 5000, 
        feed_in_limit: 100,
    },
    {
        grid_code: 363, country_code: 36, timezone: "Australia/Sydney", language_code: 3, gateway_conn: 0, sftp_address: "52.64.248.53", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 5000, inverter_export_power_limit: 5000, 
        feed_in_limit: 100,
    },
    {
        grid_code: 554, country_code: 554, timezone: "Pacific/Auckland", language_code: 3, gateway_conn: 0, sftp_address: "52.64.248.53", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 5000, inverter_export_power_limit: 5000, 
        feed_in_limit: 100,
    },
    {
        grid_code: 2501, country_code: 250, timezone: "Europe/Paris", language_code: 4, gateway_conn: 0, sftp_address: "3.124.225.92", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 5000, inverter_export_power_limit: 5000, 
        feed_in_limit: 100,
    },
    {
        grid_code: 2502, country_code: 250, timezone: "Europe/Paris", language_code: 4, gateway_conn: 0, sftp_address: "3.124.225.92", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 5000, inverter_export_power_limit: 5000, 
        feed_in_limit: 100,
    },
    {
        grid_code: 2503, country_code: 250, timezone: "Europe/Paris", language_code: 4, gateway_conn: 0, sftp_address: "3.124.225.92", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 5000, inverter_export_power_limit: 5000, 
        feed_in_limit: 100,
    },
    {
        grid_code: 2504, country_code: 250, timezone: "Europe/Paris", language_code: 4, gateway_conn: 0, sftp_address: "3.124.225.92", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 5000, inverter_export_power_limit: 5000, 
        feed_in_limit: 100,
    },
    {
        grid_code: 2506, country_code: 250, timezone: "Europe/Paris", language_code: 4, gateway_conn: 0, sftp_address: "3.124.225.92", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 5000, inverter_export_power_limit: 5000, 
        feed_in_limit: 100,
    },
    {
        grid_code: 2507, country_code: 250, timezone: "Europe/Paris", language_code: 4, gateway_conn: 0, sftp_address: "3.124.225.92", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 5000, inverter_export_power_limit: 5000, 
        feed_in_limit: 100,
    },
    {
        grid_code: 826, country_code: 826, timezone: "Europe/London", language_code: 2, gateway_conn: 0, sftp_address: "3.124.225.92", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 5000, inverter_export_power_limit: 5000, 
        feed_in_limit: 100,
    },
    {
        grid_code: 8262, country_code: 826, timezone: "Europe/London", language_code: 2, gateway_conn: 0, sftp_address: "3.124.225.92", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 5000, inverter_export_power_limit: 5000, 
        feed_in_limit: 100,
    },
    {
        grid_code: 372, country_code: 372, timezone: "Europe/Dublin", language_code: 2, gateway_conn: 0, sftp_address: "3.124.225.92", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 5000, inverter_export_power_limit: 5000, 
        feed_in_limit: 100,
    },
    // {
    //     grid_code: 392, country_code: 392, timezone: "Asia/Tokyo", language_code: 7, gateway_conn: 0, sftp_address: "", 
    //     battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 4950, inverter_export_power_limit: 4950, 
    //     feed_in_limit: 100,
    // },
    {
        grid_code: 8401, country_code: 840, timezone: "America/New_York", language_code: 1, gateway_conn: 0, sftp_address: "", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 7600, inverter_export_power_limit: 7600, 
        feed_in_limit: 100,
    },
    {
        grid_code: 8401, country_code: 840, timezone: "America/New_York", language_code: 1, gateway_conn: 0, sftp_address: "", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 11400, inverter_export_power_limit: 11400, 
        feed_in_limit: 100,
    },
    {
        grid_code: 8402, country_code: 840, timezone: "America/New_York", language_code: 1, gateway_conn: 0, sftp_address: "", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 7600, inverter_export_power_limit: 7600, 
        feed_in_limit: 100,
    },
    {
        grid_code: 8402, country_code: 840, timezone: "America/New_York", language_code: 1, gateway_conn: 0, sftp_address: "", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 11400, inverter_export_power_limit: 11400, 
        feed_in_limit: 100,
    },
    {
        grid_code: 8403, country_code: 840, timezone: "America/New_York", language_code: 1, gateway_conn: 0, sftp_address: "", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 7600, inverter_export_power_limit: 7600, 
        feed_in_limit: 100,
    },
    {
        grid_code: 8403, country_code: 840, timezone: "America/New_York", language_code: 1, gateway_conn: 0, sftp_address: "", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 11400, inverter_export_power_limit: 11400, 
        feed_in_limit: 100,
    },
    {
        grid_code: 8404, country_code: 840, timezone: "America/New_York", language_code: 1, gateway_conn: 0, sftp_address: "", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 7600, inverter_export_power_limit: 7600, 
        feed_in_limit: 100,
    },
    {
        grid_code: 8404, country_code: 840, timezone: "America/New_York", language_code: 1, gateway_conn: 0, sftp_address: "", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 11400, inverter_export_power_limit: 11400, 
        feed_in_limit: 100,
    },
    {
        grid_code: 8405, country_code: 840, timezone: "America/New_York", language_code: 1, gateway_conn: 0, sftp_address: "", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 7600, inverter_export_power_limit: 7600, 
        feed_in_limit: 100,
    },
    {
        grid_code: 8405, country_code: 840, timezone: "America/New_York", language_code: 1, gateway_conn: 0, sftp_address: "", 
        battery_hysteresis_low: 15, battery_hysteresis_high: 90, battery_backup_soc: 0, inverter_import_power_limit: 11400, inverter_export_power_limit: 11400, 
        feed_in_limit: 100,
    },
]

for(let obj in GRID_CODE_LIST) {
    GRID_CODE_LIST[obj].setExtValue(EXT_VALUE_LIST[obj]);
}

export {
    GridCode,
    GRID_CODE_LIST,
}