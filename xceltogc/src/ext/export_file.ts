import * as fs from 'fs';

function exportDataToJsonFile(data: any, filename: string) {
    fs.writeFileSync('/result' + filename + '.json', data, 'utf8');
}

export {
    exportDataToJsonFile,
}