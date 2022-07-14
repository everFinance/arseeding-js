import { CreateAndSubmitItem } from '../src/submitOrder'
import EthereumSigner from 'arseeding-arbundles/src/signing/chains/ethereumSigner'

// ts-node ./example/uploadFile.ts
async function uploadFile () {
    // this key is used to bundle data signer
    const privateKey = ''
    const eccSigner = new EthereumSigner(privateKey)

    const ops = {
        tags: [
            { name: 'key01', value: 'val01' },
            { name: 'Content-Type', value: 'imag/png' }
        ]
    }
    const arseedingUrl = 'https://arseed.web3infura.io'
    const tokenSymbol = 'VRT'
    const data = Buffer.from('aa bb cc')
    const order = await CreateAndSubmitItem(eccSigner, data, ops, arseedingUrl, tokenSymbol)
    console.log('order', order)
}

uploadFile()

