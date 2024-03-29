import { GridCode } from "./GridCode"

// const SHEET_INDEX_HISTORY = 0;
const SHEET_INDEX_ACMI_1547 = 1;
const SHEET_INDEX_ACMI = 2;
// const SHEET_INDEX_ACES_TESTMODE = 3;
const SHEET_INDEX_ACES = 4;
const SHEET_INDEX_MOW = 5;

const EMS_DB_COLUMN_NAME_ACMI_1547_TAB = "T";
const EMS_DB_COLUMN_NAME_ACMI_TAB = "W";
// const EMS_DB_COLUMN_NAME_ACES_TESTMODE_TAB = "U";
const EMS_DB_COLUMN_NAME_ACES_TAB = "Y";
const EMS_DB_COLUMN_NAME_MOW_TAB = "AI";
const EMS_DB_COLUMN_NAME_ERROR = "ZZ"; // ERROR Case

const SHEET_DB_COLUMN_MAP = [
    {
        sheet: SHEET_INDEX_ACMI_1547,
        column: EMS_DB_COLUMN_NAME_ACMI_1547_TAB
    },
    {
        sheet: SHEET_INDEX_ACMI,
        column: EMS_DB_COLUMN_NAME_ACMI_TAB
    },
    {
        sheet: SHEET_INDEX_ACES,
        column: EMS_DB_COLUMN_NAME_ACES_TAB
    },
    {
        sheet: SHEET_INDEX_MOW,
        column: EMS_DB_COLUMN_NAME_MOW_TAB
    }
]

function getEmsDbColumnForSheet(sheet: number) {
    for(let o of SHEET_DB_COLUMN_MAP) {
        if(o.sheet === sheet) {
            return o.column;
        }
    }

    console.log("=============================================");
    console.log("[ERROR] EMS DB Column name can not be found!!");
    console.log("[ERROR] sheet = " + sheet);
    console.log("=============================================");
    return EMS_DB_COLUMN_NAME_ERROR;
}

const GRID_CODE_LIST = [
    new GridCode(8452, SHEET_INDEX_ACMI_1547, "K"),

    new GridCode(8451, SHEET_INDEX_ACMI, "K"),
    new GridCode(8453, SHEET_INDEX_ACMI, "L"),
    new GridCode(8454, SHEET_INDEX_ACMI, "M"),
    new GridCode(8455, SHEET_INDEX_ACMI, "N"),

    new GridCode(8401, SHEET_INDEX_ACES, "J"),
    new GridCode(8402, SHEET_INDEX_ACES, "K"),
    new GridCode(8403, SHEET_INDEX_ACES, "L"),
    new GridCode(8404, SHEET_INDEX_ACES, "M"),
    new GridCode(8406, SHEET_INDEX_ACES, "N"),

    new GridCode(276,  SHEET_INDEX_MOW, "H"),
    new GridCode(361,  SHEET_INDEX_MOW, "I"),
    new GridCode(362,  SHEET_INDEX_MOW, "J"),
    new GridCode(363,  SHEET_INDEX_MOW, "K"),
    new GridCode(554,  SHEET_INDEX_MOW, "L"),
    new GridCode(2501, SHEET_INDEX_MOW, "M"),
    new GridCode(2502, SHEET_INDEX_MOW, "N"),
    new GridCode(2503, SHEET_INDEX_MOW, "O"),
    new GridCode(2504, SHEET_INDEX_MOW, "P"),
    new GridCode(2506, SHEET_INDEX_MOW, "R"),
    new GridCode(2507, SHEET_INDEX_MOW, "S"),
    new GridCode(826,  SHEET_INDEX_MOW, "T"),
    new GridCode(6201, SHEET_INDEX_MOW, "U"),
    new GridCode(6202, SHEET_INDEX_MOW, "V"),
    new GridCode(8262, SHEET_INDEX_MOW, "W"),
    new GridCode(372,  SHEET_INDEX_MOW, "X"),
    new GridCode(901,  SHEET_INDEX_MOW, "Z"),
    new GridCode(410,  SHEET_INDEX_MOW, "AB"),
    new GridCode(704,  SHEET_INDEX_MOW, "AC"),
]

export {
    SHEET_INDEX_ACMI_1547,
    SHEET_INDEX_ACMI,
    GRID_CODE_LIST,
    getEmsDbColumnForSheet,
}