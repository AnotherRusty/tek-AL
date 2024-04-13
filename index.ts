import * as XLSX from 'xlsx';
import fs from 'fs';

interface Info {
    [address: string]: {
        token:
        [
            {
                num: number,
                time: Date
            }
        ]
        level: number,
        claimable: number
    }
}

const defaultValue = {
    token: [{ num: 0, time: new Date() }] as [{ num: number; time: Date; }],
    level: 0,
    claimable: 0
}

let claimableData: Info = {}
const workbook: XLSX.WorkBook = XLSX.readFile('info.xlsx'); // Replace 'example.xlsx' with your file name

// Assuming only one sheet in the workbook
const sheetName: string = workbook.SheetNames[0];
const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

// Convert the worksheet to a JSON object
const data: any[] = XLSX.utils.sheet_to_json(worksheet);

// data.map((val, idx) => {
//     const address = val.address
//     if (claimableData[address] == undefined) {
//         claimableData[address] = defaultValue
//     }
//     const action = val.action
//     const time = val.timestamp
//     const tokens = val.tokens.toString()
//     if (action == 'stake') {
//         const tokenList = tokens.split(';')
//         tokenList.map((item: any) => {
//             claimableData[address].token.push({ num: item, time: time })
//         })
//     }
// })

const dataJson = JSON.stringify(data, null, 4);
fs.writeFile('data.json', dataJson, (err) => {
    if (err) {
        console.log('Error writing file:', err);
    } else {
        console.log(`wrote file data.json`);
    }
})