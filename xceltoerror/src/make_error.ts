import * as xlsx from 'xlsx'

const SHEET_INDEX = 2;

type ObjectKeyType = {
    [key: string]: string;
}

const ErrorObjMap:ObjectKeyType = {
    A: "Level",
    B: "Code",
    C: "Master",
    D: "Slave+E:G",
    E: "PCS Error code(CAN Map)",
    F: "Description_Key",
    G: "Description",
    H: "SET Condition",
    I: "Detection Time",
    J: "RELEASE Condition",
    K: "Release Time",
    L: "Possible_Cause_Key",
    M: "How_to_Fix_Key",
    N: "Possible Cause",
    O: "How to Fix",
    P: "Remarks",
}

function getFile(filename: string):object {
    try {
        const excelFile = xlsx.readFile(filename);
        const sheetName = excelFile.SheetNames[SHEET_INDEX];
        console.log("sheetName = ", sheetName);
        const sheetContent = excelFile.Sheets[sheetName];

        let retArray: ObjectKeyType[] = [];
        
        const regexGetRow = /[^0-9]/g;
        const regexGetColumn = /[^a-zA-Z]/g;
        const regexNextLine = /[\n]/g;
        const stringNextLine = "<br />";
        
        for(let obj in sheetContent) {
            let mColumn = obj.replace(regexGetColumn, "");
            if(mColumn === "A") {
                let retItem:ObjectKeyType = {};
                let mRow = obj.replace(regexGetRow, "");
                if(mRow === "1") {
                    // Header row
                } else {
                    for(let key in ErrorObjMap) {
                        let idx = key + mRow;
                        let value = sheetContent[idx];
                        if(value) {
                            let tmpValue = value.w.replace(regexNextLine, stringNextLine);
                            retItem[ErrorObjMap[key]] = tmpValue;
                        } else {
                            retItem[ErrorObjMap[key]] = "";
                        }
                    }
                    retArray.push(retItem);
                }
            } else {
                // Do nothing
            }
        }

        return retArray;
    } catch (error) {
        console.log(error);
    }
    return [];
}

export {
    getFile
}