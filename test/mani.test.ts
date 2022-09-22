import {batchPayOrders, uploadFolder, uploadFolderAndPay} from "../src/uploadFolder";

const path = './build'
const priv = ''
const url = 'https://arseed.web3infura.io'
const indexFile = 'ddddd'
test('mani',async ()=>{
    const {ords, fee, maniId} = await uploadFolder(path,priv,url,'USDC',indexFile)
    const res = await batchPayOrders(ords, priv)
    console.log(ords.length, fee, maniId)
    console.log(res)
})

uploadFolder(path,priv,url,'USDC').catch((e)=>{
    console.log(e)
}).then((res)=>{
    console.log(res)
})

