import {checkPaths} from "../src/manifest";
import {batchPay, uploadFolder, uploadFolderAndPay} from "../src/uploadFolder";

const path = './build'
const priv = ''
const url = 'https://arseed-dev.web3infura.io'
const apiKey = ''
test('mani',async ()=>{
    const {ords, fee, maniId} = await uploadFolder(path,priv,url,'USDC',apiKey)
    // const res = await batchPay(ords, priv)
    console.log(ords.length,fee, maniId)
    // console.log(res)
})