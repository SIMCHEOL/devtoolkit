const defines = {
    production_MOW : 2,
    production_MOW_COLUMN : "AC",
    production_PVES : 3,
    production_PVES_COLUMN : "Z",
    PVES_POWER_PIVOT : 7600,
    DB_ITEM_GRID_CODE : "grid_code",
}

interface ExtValue {
    [idx: string]: string | number;
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
}


export {
    defines,
    ExtValue,
}