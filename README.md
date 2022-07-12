# arseeding-js

### Install
```
npm i arseeding-js
```
### example
```ts
import { genAPI } from 'arseeding-js'
const instance = await genAPI(window.ethereum)

const arseedUrl = 'https://arseed.web3infura.io'
const data = Buffer.from('........')
const payCurrency = 'usdc' // everpay supported all tokens
const ops = {
    tags: [{name: "Content-Type",value:'data type'}]
}
const res = await instance.sendAndPay(arseedUrl, data, payCurrency, ops)
console.log('res',res)

// review data
curl --location --request GET 'https://arseed.web3infura.io/{{res.order.itemId}}'
```

### example2 - node
```ts
import { genNodeAPI } from 'arseeding-js'

const instance = await genNodeAPI('YOUR PRIVATE KEY')

instance.sendAndPay('https://arseed.web3infura.io', Buffer.from('aa bb cc'), 'usdc', {})
```
