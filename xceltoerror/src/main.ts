import * as make_error from './make_error';
import * as ef from './export_file';

let result: object, json_string: string

hello();

result = make_error.getFile(process.argv[2]);
json_string = JSON.stringify(result);
let filename: string = String("error_code_list");


ef.exportDataToJsonFile(json_string, filename);

bye();

function hello() {
    console.log("=== Start process ===");
}

function bye() {
    console.log("=== End process ===");
}