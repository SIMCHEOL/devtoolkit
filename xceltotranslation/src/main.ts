import * as make_default from './make_default';
import * as ef from './ext/export_file';

let result: object , json_string: string
make_default.hello();

result = make_default.getFile(process.argv[2]);
json_string = JSON.stringify(result);

ef.exportDataToJsonFile(json_string, "result.json");

make_default.bye();

