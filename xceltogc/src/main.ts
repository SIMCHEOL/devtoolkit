import * as make_default from './make_default';
import * as ef from './ext/export_file';
import { GRID_CODE_LIST } from './grid_code';
import { defines } from './constants';

let result: object , json_string: string

make_default.hello();

for(let obj of GRID_CODE_LIST) {
    result = make_default.getFile(process.argv[2], obj);
    json_string = JSON.stringify(result);
    let filename: string;
    if(obj.pr === defines.production_PVES) {
        if(obj.ca > defines.PVES_POWER_PIVOT) {
            filename = String(obj.gc) + "_2";
        } else {
            filename = String(obj.gc) + "_1";
        }
    } else {
        filename = String(obj.gc);
    }
    ef.exportDataToJsonFile(json_string, filename);
}

make_default.bye();

