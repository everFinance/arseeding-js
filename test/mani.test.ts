import {checkPaths} from "../src/manifest";
import {batchPay, uploadFolder, uploadFolderAndPay} from "../src/uploadFolder";

const path = './test'
const priv = ''
const url = 'https://arseed.web3infura.io'
test('mani',async ()=>{
    const {ords, fee, maniId} = await uploadFolder(path,priv,url,'USDC')
    const res = await batchPay(ords, priv)
    console.log(fee, maniId)
    console.log(res)
})