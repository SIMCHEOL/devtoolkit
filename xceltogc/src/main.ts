import * as make_default from './make_default';
import * as ef from './ext/export_file';
import { GRID_CODE_LIST } from './grid_code';

let result: object , json_string: string

make_default.hello();

for(let obj of GRID_CODE_LIST) {
    result = make_default.getFile(process.argv[2], obj);
    json_string = JSON.stringify(result);
    let filename: string;
    filename = String(obj.gc);
    ef.exportDataToJsonFile(json_string, filename);
}

make_default.bye();

