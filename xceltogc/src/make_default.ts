import * as xlsx from 'xlsx'
import { defines } from './constants'
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

function getFile(filename: string, grid_code: GridCode):object {
    try {
        const excelFile = xlsx.readFile(filename);
        const sheetName = excelFile.SheetNames[grid_code.pr];
        const sheetContent = excelFile.Sheets[sheetName];

        let emsDbColumn = grid_code.pr === defines.production_MOW ? defines.production_MOW_COLUMN : defines.production_PVES_COLUMN;
        let defaultDbColumn = grid_code.dc;

        console.log("Grid code :", grid_code.gc , ", Capacity :", grid_code.ca ,", Sheet name ->", sheetName);
        let tmp_json: ObjectKeyType = initDefaultValue(grid_code);
        let retArray: ObjectKeyType[] = [];
        
        const regex_column = /[^0-9]/g;
        const regex_row = /[^a-zA-Z]/g;
        const regex_bucket = /\(.*\)/g;

        for(let obj in sheetContent) {
            if(obj.replace(regex_row, "") === emsDbColumn) {
                if(sheetContent[obj].w) {
                    // If ems db has this key
                    let key: string = sheetContent[obj].w;
                    let value: string = "";
                    value = String(sheetContent[defaultDbColumn + obj.replace(regex_column, "")]?.w);
                    
                    // Only USA Grid Code Case
                    if(grid_code.pr === defines.production_PVES) {
                        // Select one both 2 items.
                        if(value.indexOf("/") !== -1) {
                            if(grid_code.ca > defines.PVES_POWER_PIVOT) {
                                value = value.split("/")[1];
                            } else {
                                value = value.split("/")[0];
                            }
                        }
                    }
                    value = value.trim();
                    value = value.replace(regex_bucket, "");
                    tmp_json[key] = valueFilter(value);

                } else {
                    // This cell havn't value.
                }
            } else {
                // do nothing.
            }
        }
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