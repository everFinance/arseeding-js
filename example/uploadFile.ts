import { createAndSubmitItem } from '../src/submitOrder'
import EthereumSigner from 'arseeding-arbundles/src/signing/chains/ethereumSigner'
// import ArweaveSigner from "arseeding-arbundles/src/signing/chains/ArweaveSigner";
// import {readFileSync} from "fs";
// import path from "path";
import { Signer } from 'arseeding-arbundles/src/signing'

// ts-node ./example/uploadFile.ts
async function uploadFile (signer: Signer) {
    const ops = {
        tags: [
            { name: 'key01', value: 'val01' },
            { name: 'Content-Type', value: 'imag/png' }
        ]
    }
    const arseedingUrl = 'https://arseed.web3infura.io'
    const currency = 'VRT'
    const data = Buffer.from('aa bb cc')
    const order = await createAndSubmitItem(arseedingUrl, signer, data, ops, currency)
    console.log('order', order)
}

// ecc signer
const privateKey = ''
const eccSigner = new EthereumSigner(privateKey)
uploadFile(eccSigner)

// // rsa signer
// const wallet = JSON.parse(
//     readFileSync(path.join(__dirname, "test_key.json")).toString(),
// );
// const rsaSigner = new ArweaveSigner(wallet)
// uploadFile(rsaSigner)
