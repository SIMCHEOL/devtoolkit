import * as fs from 'fs';

function exportDataToJsonFile(data: any, filename: string) {
    if(!fs.existsSync('./result')) {
        fs.mkdirSync('result')
    }
    fs.writeFileSync('./result/' + filename + '.json', data, 'utf8');
}

export {
    exportDataToJsonFile,
}