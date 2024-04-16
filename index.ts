import * as XLSX from 'xlsx';
import fs from 'fs';

interface Info {
    [address: string]: {
        token:
        [
            {
                num: number,
                time: Date
                level: number,
            }
        ],
        amount: {
            bronze: number,
            silver: number,
            gold: number,
            diamond: number
        },
        claimable: boolean
    }
}

let userInfo: Info = {}
let endTime: Date = new Date()

const fetchExcel = async () => {
    const workbook: XLSX.WorkBook = XLSX.readFile('info.xlsx'); // Replace 'example.xlsx' with your file name

    // Assuming only one sheet in the workbook
    const sheetName: string = workbook.SheetNames[0];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

    // Convert the worksheet to a JSON object
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);
    const dataJson = JSON.stringify(data, null, 4);
    fs.writeFile('data.json', dataJson, (err) => {
        if (err) {
            console.log('Error writing file:', err);
        } else {
            console.log(`wrote file data.json`);
        }
    })
}

const start = async () => {
    const data = JSON.parse(fs.readFileSync("data.json", `utf8`))
    data.map((val: any, idx: number) => {
        const address = val.address
        const action = val.action
        const timestamp: Date = val.timestamp
        endTime = timestamp
        const tokenArr = val.tokens.toString().split(';')

        if (!(address in userInfo)) {
            userInfo[address] = {
                token: [{ num: 0, time: new Date(), level: 0 }], amount: {
                    bronze: 0,
                    silver: 0,
                    gold: 0,
                    diamond: 0
                }, claimable: true
            }
        }

        if (action == 'stake') {
            let level = 0
            let cnt = 0
            userInfo[address].token.map((item: {
                num: number;
                time: Date;
                level: number;
            }) => {
                if (item.num != 0) {
                    if (Math.floor(((new Date(timestamp)).getTime() - (new Date(item.time)).getTime()) / (86400 * 7000)) > 0) cnt++
                }
                if (cnt > 18) level = 3
                else if (cnt > 9) level = 2
                else if (cnt > 3) level = 1
                else level = 0
            })
            userInfo[address].token.push(...tokenArr.map((token: string) => ({
                num: token, time: timestamp, level
            })))
        } else if (action == 'unstake') {
            const newArr = userInfo[address].token.filter((item: {
                num: number;
                time: Date;
                level: number;
            }) => {
                const involve = tokenArr.includes(item.num.toString())
                if (involve) {
                    const duration = Math.floor(((new Date(timestamp)).getTime() - (new Date(item.time)).getTime()) / (86400 * 7000))
                    switch (item.level) {
                        case 0:
                            userInfo[address].amount.bronze += duration
                            break
                        case 1:
                            userInfo[address].amount.silver += duration
                            break
                        case 2:
                            userInfo[address].amount.gold += duration
                            break
                        case 3:
                            userInfo[address].amount.diamond += duration
                            break
                    }
                }

                return !involve
            }) as [{ num: number; time: Date; level: number }];
            userInfo[address].token = newArr
        }

    })

    return
}

const finish = async () => {
    for (const [address, details] of Object.entries(userInfo)) {
        details.token.map((val: {
            num: number;
            time: Date;
            level: number;
        }, idx: number) => {
            if (val.num > 0) {
                const duration = Math.floor(((new Date(endTime)).getTime() - (new Date(val.time)).getTime()) / (86400 * 7000))

                switch (val.level) {
                    case 0:
                        userInfo[address].amount.bronze += duration
                        break
                    case 1:
                        userInfo[address].amount.silver += duration
                        break
                    case 2:
                        userInfo[address].amount.gold += duration
                        break
                    case 3:
                        userInfo[address].amount.diamond += duration
                        break
                }
            }
        })
    }

    const dataJson = JSON.stringify(userInfo, null, 4);
    fs.writeFile('res.json', dataJson, (err) => {
        if (err) {
            console.log('Error writing file:', err);
        } else {
            console.log(`wrote file res.json`);
        }
    })
}

start()
finish()