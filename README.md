# arseeding-js

### Install
```
npm i arseeding-js
```
### example
```ts
import { genAPI } from 'arseeding-js'
const instance = await genAPI(window.ethereum)

const arseedUrl = 'https://arseed.web3infra.dev'
const data = Buffer.from('........')
const payCurrency = 'usdc' // everpay supported all tokens
const ops = {
    tags: [{name: "Content-Type",value:'data type'}]
}
const res = await instance.sendAndPay(arseedUrl, data, payCurrency, ops)
console.log('res',res)

// review data
curl --location --request GET 'https://arseed.web3infra.dev/{{res.order.itemId}}'
```

### example2 - node
```ts
import { genNodeAPI } from 'arseeding-js'

const instance = await genNodeAPI('YOUR PRIVATE KEY')

instance.sendAndPay('https://arseed.web3infra.dev', Buffer.from('aa bb cc'), 'usdc', {})
```

### example3 - upload folder
```ts
import {batchPayOrders, uploadFolder, uploadFolderAndPay} from "arseeding-js/cjs/uploadFolder";

const path = './src/nft'
const priv = '9d8bdd0d2f1e73dffe9252ee6f38325b7e195669541f76559760ef615a588be8'
const url = 'https://arseed.web3infra.dev'
const currency = 'USDC' // or ETH,BNB etc.


uploadFolderAndPay(path,priv,url,'USDC').catch((e)=>{
    console.log(e)
}).then((res)=>{
    console.log(res.maniId)
})

// review manifest Data
curl --location --request GET 'https://arseed.web3infra.dev/{res.maniId}'
```
uploadFolderAndPay can be divided by uploadFolder and batchPayOrders