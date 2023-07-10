# arseeding-js

### Install
```
npm i arseeding-js
```
### example
```ts
import { genAPI, getTokenTagByEver } from 'arseeding-js'
const instance = await genAPI(window.ethereum)

const arseedUrl = 'https://arseed.web3infra.dev'
const data = Buffer.from('........')
const tokenTags = await getTokenTagByEver('usdc')  // everpay supported all tokens
const payCurrencyTag = tokenTags[0]
const ops = {
    tags: [{name: "Content-Type",value:'data type'}]
}
const res = await instance.sendAndPay(arseedUrl, data, payCurrencyTag, ops)
console.log('res',res)

// review data
curl --location --request GET 'https://arseed.web3infra.dev/{{res.order.itemId}}'
```

### example2 - node
```ts
import { genNodeAPI } from 'arseeding-js'

const instance = await genNodeAPI('YOUR PRIVATE KEY')
const tokenTags = await getTokenTagByEver('usdc')  // everpay supported all tokens
const payCurrencyTag = tokenTags[0]

instance.sendAndPay('https://arseed.web3infra.dev', Buffer.from('aa bb cc'), payCurrencyTag, {})
```

### example3 - upload folder
```ts
import {batchPayOrders, uploadFolder, uploadFolderAndPay} from "arseeding-js/cjs/uploadFolder";

const path = './src/nft'
const priv = '9d8bdd0d2f1e73dffe9252ee6f38325b7e195669541f76559760ef615a588be8'
const url = 'https://arseed.web3infra.dev'
const tokenTags = await getTokenTagByEver('usdc')  // everpay supported all tokens
const payCurrencyTag = tokenTags[0]
const indexFile = ''

uploadFolderAndPay(path,priv,url,payCurrencyTag, indexFile).then((res)=>{
  console.log(res)
}).catch((err)=>{
  console.log(err)
})

// review manifest Data
curl --location --request GET 'https://arseed.web3infra.dev/{res.maniId}'
```
uploadFolderAndPay can be divided by uploadFolder and batchPayOrders