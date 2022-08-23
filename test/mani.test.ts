import {checkPaths} from "../src/manifest";
import {batchPayOrders, uploadFolder} from "../src/uploadFolder";

const path = './test/dist'
const priv = ''
const url = 'https://arseed-dev.web3infra.dev'
const apiKey = ''

test('manifest_uploadFolder',async ()=>{
    const {ords, fee, maniId} = await uploadFolder(path,priv,url,'USDC',apiKey)
    const res = await batchPayOrders(ords, priv)
    console.log(ords.length,fee, maniId)
    console.log(res)
})
