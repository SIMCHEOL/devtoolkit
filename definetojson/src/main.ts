let fs = require('fs');
let filename: string =  process.argv[2];
let output: string = "output.txt";
console.log("INPUT FILE NAME :", filename);


fs.open(output, 'w', function(err: any, fd: any) {
    if (err) throw err;
    console.log("file created! fd = ", fd)
})

let str = fs.readFileSync(filename).toString().split("\n");
let data = ''
for(let i in str) {
    console.log(str[i]);
    let tmp_str = String(str[i]).replace(/	+/g, ' ');
    tmp_str = tmp_str.replace(/ +/g, ' ');
    console.log(str[i], "=>", tmp_str);
    let tmp = tmp_str.split(' ');
    let tmp_key = tmp[0];
    let tmp_parse_type = String(tmp[1]);
    let parse_target = "PARSE.UNKNOWN";
    if(tmp_parse_type.search(/varchar/gi) >= 0 || tmp_parse_type.search(/datetime/gi) >= 0 || tmp_parse_type.search(/text/gi) >= 0 ) {
        parse_target = "PARSE.STRING";
    } else if(tmp_parse_type.search(/integer/gi) >= 0) {
        parse_target = "PARSE.INTEGER";
    } else if(tmp_parse_type.search(/real/gi) >= 0 || tmp_parse_type.search(/float/gi) >= 0) {
        parse_target = "PARSE.FLOAT";
    } else {
        console.log("DB ITEM ERROR !!!!!!!!", tmp_parse_type, tmp_parse_type === "integer");
        break;
    }
    data += '{ key: "' + tmp_key + '", parse_type:' + parse_target + ', privilege: PRIVILEGE_LEVEL.COMMON },' + '\n';
}

fs.writeFile(output, data, 'utf8', function(err: any){
    if (err) throw err;
});
