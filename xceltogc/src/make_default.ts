import * as xlsx from 'xlsx'
import { getEmsDbColumnForSheet, SHEET_INDEX_ACMI, SHEET_INDEX_ACMI_1547 } from './excel_sheet_info'
import { getEmsDefaultValue, getAdditionalValues } from './ems_value_list';
import { GridCode, EmsDefaultValue } from './GridCode';

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

function getEmsDefaultJsonObject(default_value: EmsDefaultValue): ObjectKeyType {
    let ret: ObjectKeyType = {};

    for(let idx in default_value) {
        ret[idx] = String(default_value[idx]);
    }

    return ret;
}

function valueFilter(gc: number, val: string): string {
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
        b: 1,
        possible: 1,
        impossible: 0,
    }

    if(gc >= 8401) {
        keyword_table.under = 1;
        keyword_table.over = 0;
    }

    if(tmp in keyword_table) {
        ret = String(keyword_table[tmp]);
    } else {
        ret = tmp;
        if(isNaN(parseInt(tmp))) {
            console.log("This keyword["+tmp+"] can not be found in keyword table.");
        }
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
        const sheetName = excelFile.SheetNames[grid_code.sheet_index];
        const sheetContent = excelFile.Sheets[sheetName];

        let emsDbColumn = getEmsDbColumnForSheet(grid_code.sheet_index);
        let defaultDbColumn = grid_code.dc;

        console.log("Grid code :", grid_code.gc , ", Sheet name ->", sheetName);
        grid_code.setEmsValue(getEmsDefaultValue(grid_code.gc));
        let tmp_json: ObjectKeyType = getEmsDefaultJsonObject(grid_code.getEmsValue());
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
                    value = valueFilter(grid_code.gc, value);
                    if(grid_code.sheet_index === SHEET_INDEX_ACMI || grid_code.sheet_index === SHEET_INDEX_ACMI_1547) {
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