import { createAndSubmitItem } from '../src/submitOrder'
import { getTokenTagByEver, ArweaveSigner, EthereumSigner } from '../src'
import path from 'path'
import { Signer } from 'arseeding-arbundles/src/signing'
import { Config } from '../src/types'
import { readFileSync } from 'fs'

// ts-node ./example/uploadFile.ts
async function uploadFile (signer: Signer) {
  const ops = {
    tags: [
      { name: 'key01', value: 'val01' },
      { name: 'Content-Type', value: 'imag/png' }
    ]
  }
  const arseedingUrl = 'https://arseed.web3infra.dev'
  const currencyTags = await getTokenTagByEver('VRT')
  const cfg: Config = {
    signer: signer,
    path: '',
    arseedUrl: arseedingUrl,
    tag: currencyTags[0]
  }
  const data = Buffer.from('aa bb cc')
  const order = await createAndSubmitItem(data, ops, cfg)
  console.log('order', order)
}

// ecc signer
const privateKey = ''
const eccSigner = new EthereumSigner(privateKey)
uploadFile(eccSigner)

// rsa signer
const testKeyJSON = ''
const wallet = JSON.parse(
  readFileSync(path.join(__dirname, testKeyJSON)).toString()
)
const rsaSigner = new ArweaveSigner(wallet)
uploadFile(rsaSigner)
