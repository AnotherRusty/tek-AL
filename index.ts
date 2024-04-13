import * as XLSX from 'xlsx';
import fs from 'fs';
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

interface Info {
    [address: string]: {
        token:
        [
            {
                num: number,
                time: Date
                level: number,
            }
        ]
        claimable: number
    }
}

const defaultValue = {
    token: [{ num: 0, time: new Date() }] as [{ num: number; time: Date; }],
    level: 0,
    claimable: 0
}

const mongoURL = process.env.mongoURL!

const UserSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    tokens: [
        {
            num: Number,
            time: Date
        }
    ]
});

const UserModel = mongoose.model("user", UserSchema);
let userInfo: Info

const start = async () => {

    await mongoose.connect(mongoURL);
    const data = JSON.parse(fs.readFileSync("data.json", `utf8`))
    data.map(async (val: any, idx: any) => {
        const address = val.address
        const action = val.action
        const timestamp = val.timestamp

        if (!(address in userInfo)) {
            userInfo[address] = { token: [{ num: 0, time: new Date(), level: 0 }], claimable: 0 }
        }
        
        const level = 0

        if(action == 'stake') {
            userInfo[address].token.concat()
        }
        const tokenArr = val.tokens.toString().split(';')
        tokenArr.map((token: any) => {

        })
    })
}
// const dataJson = JSON.stringify(data, null, 4);
// fs.writeFile('data.json', dataJson, (err) => {
//     if (err) {
//         console.log('Error writing file:', err);
//     } else {
//         console.log(`wrote file data.json`);
//     }
// })

start()