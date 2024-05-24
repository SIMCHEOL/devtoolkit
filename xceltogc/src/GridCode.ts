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
    sftp_address: string;
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
        this.sftp_address = "";
        this.feed_in_limit = 0;
    }

   public setEmsValue(o: EmsDefaultValue) {
        this.gc = o.grid_code;
        this.country_code = o.country_code;
        this.timezone = o.timezone;
        this.language_code = o.language_code;
        this.sftp_address = o.sftp_address;
        this.feed_in_limit = o.feed_in_limit;
   }

   public getEmsValue(): EmsDefaultValue {
       let retObj: EmsDefaultValue = {
            grid_code: this.gc,
            country_code: this.country_code,
            timezone: this.timezone,
            language_code: this.language_code,
            sftp_address: this.sftp_address,
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
    sftp_address: string;
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