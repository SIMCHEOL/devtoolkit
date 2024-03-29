class GridCode {

    /**
     * grid_code
     */
    gc: number;

    /**
     * production (MOW | PVES | ACMI | ACMI_CERT)
     */
    sheet_index: number;

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

    /**
     * 
     * @param grid_code grid code value.
     * @param production Data sheet index in Excel file.
     * @param dc  Data Column index in Excel file.
     */
    constructor(grid_code: number, production: number, dc: string) {
        this.gc = grid_code;
        this.sheet_index = production;
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

   public setEmsValue(o: EmsDefaultValue) {
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

   public getEmsValue(): EmsDefaultValue {
       let retObj: EmsDefaultValue = {
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

interface EmsDefaultValue {
    [idx: string]: string | number | undefined;
    grid_code: number;
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
    pcs_connection_mode?: number;
    pcs_conn?: number;
    meter_model?: number;
    meter_model_pv?: number;
    installed_rack_count?: number;
    meter_load_from_gw?: number;
    meter_load_from_gw_pv?: number;
    install_done?: number;
}

export {
    GridCode,
    EmsDefaultValue,
}