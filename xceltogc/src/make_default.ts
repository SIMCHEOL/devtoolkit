import * as xlsx from 'xlsx'
import { defines, edmSheetEMSColDefines } from './constants'
import { GridCode } from './grid_code';

function hello() {
    console.log("=== Start process ===");
}

function bye() {
    console.log("=== End process ===");
}

type ObjectKeyType = {
    [key: string]: string;
}

type KeywordType = {
    [idx: string]: number;
}

function initDefaultValue(gc: GridCode): ObjectKeyType {
    let ret: ObjectKeyType = {};

    for(let idx in gc.getExtValue()) {
        ret[idx] = String(gc.getExtValue()[idx]);
    }

    return ret;
}

/* 
 *  getAdditionalValues() is called after grid code settings.
 *  This values are depend on partial grid code. so, this values will be added at last in JSON file.
 */
function getAdditionalValues(result: any) {
    if(result.grid_code == 901) {
        result["pcs_connection_mode"] = "1";
        result["pcs_conn"] = "3";
        result["meter_model"] = "0";
        result["meter_model_pv"] = "0";
    } else if (result[0].grid_code == 2506) {
        result["installed_rack_count"] = "1";
        result["meter_load_from_gw"] = "1";
        result["meter_load_from_gw_pv"] = "1";
        result["install_done"] = "1";
    }  else if (8401 <= result[0].grid_code && result[0].grid_code <= 8499) {
        result["meter_model"] = "0";
        result["meter_model_pv"] = "0";
    } else {
        console.log("Just passed.");
    }
}

function valueFilter(val: string): string {
    let ret: string = "==== WARNING ====";
    let tmp: string = val.toLowerCase();

    if(tmp === 'undefined' || typeof tmp === 'undefined' || tmp === null || tmp === "null" || tmp === "NULL") {
        tmp = "0";
    }

    let keyword_table: KeywordType = {
        enable: 1,
        disable: 0,
        switch: 1,
        maintain: 2,
        pmax: 0,
        pref: 1,
        curve: 0,
        slope: 1,
        under: 0,
        over: 1,
        undefined: 0,
        basic: 1,
        alternatice: 2, //maybe this is typo
        alternative: 2,
        irated: 0,
        prated: 1,
        operation: 1,
        "not operation": 0,
        a: 0,
        b: 1
    }

    if(tmp in keyword_table) {
        ret = String(keyword_table[tmp]);
    } else {
        ret = tmp;
    }
    
    return ret;
}

const CalcMi: KeywordType = {
    invctrl_pcs_max_apparent_power_limit: 15356,
    invctrl_pcs_varmax_q1: 8089,
    invctrl_actpwr_setting: 15356,
    invctrl_actpwr_over_excited_setting: 13052,
    invctrl_actpwr_under_excited_setting: 13052,
}

function keyFilter(key: string, value: string) {
    if(key in CalcMi) {
        value = String(CalcMi[key]);
    }
    return value;
}

function getFile(filename: string, grid_code: GridCode):object {
    try {
        const excelFile = xlsx.readFile(filename);
        const sheetName = excelFile.SheetNames[grid_code.pr];
        const sheetContent = excelFile.Sheets[sheetName];

        let emsDbColumn = edmSheetEMSColDefines[grid_code.pr];
        let defaultDbColumn = grid_code.dc;

        console.log("Grid code :", grid_code.gc , ", Sheet name ->", sheetName);
        let tmp_json: ObjectKeyType = initDefaultValue(grid_code);
        let retArray: ObjectKeyType[] = [];
        
        const regex_column = /[^0-9]/g;
        const regex_row = /[^a-zA-Z]/g;
        const regex_bucket = /\(.*\)/g;

        for(let obj in sheetContent) {
            if(obj.replace(regex_row, "") === emsDbColumn) {
                if(sheetContent[obj].w && "EMS DB column name" !== sheetContent[obj].w) {
                    // If ems db has this key
                    let key: string = sheetContent[obj].w;
                    let value: string = "";
                    value = String(sheetContent[defaultDbColumn + obj.replace(regex_column, "")]?.w);
                    
                    value = value.trim();
                    value = value.replace(regex_bucket, "");
                    value = valueFilter(value);
                    if(grid_code.pr === defines.production_ACMI || grid_code.pr === defines.production_ACMI_OFFICIAL) {
                        value = keyFilter(key, value);
                    }
                    if(key in tmp_json) {
                        console.log("key is already exists = ", key, grid_code.gc);
                    } else {
                        tmp_json[key] = value;
                    }
                } else {
                    // This cell havn't value.
                }
            } else {
                // do nothing.
            }
        }
        getAdditionalValues(tmp_json);
        retArray.push(tmp_json);
        return retArray;
    } catch (error) {
        console.log(error);
    }

    return [];
}

export { 
    hello, 
    bye,
    getFile,
};