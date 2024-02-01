const defines = {
    production_ACMI_OFFICIAL : 1,
    production_ACMI_OFFICIAL_COLUMN : "T",
    production_ACMI : 2,
    production_ACMI_COLUMN : "W",
    production_ACES : 3,
    production_ACES_COLUMN : "X",
    production_MOW : 4,
    production_MOW_COLUMN : "AI",
    DB_ITEM_GRID_CODE : "grid_code",
}

const edmSheetEMSColDefines = [
    "",
    defines.production_ACMI_OFFICIAL_COLUMN,
    defines.production_ACMI_COLUMN,
    defines.production_ACES_COLUMN,
    defines.production_MOW_COLUMN,
]

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
    edmSheetEMSColDefines,
    ExtValue,
}