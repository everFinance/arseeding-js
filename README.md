# arseeding-js

### Install
```
npm i arseeding-js@0.0.7
```
### example
```ts
import { genAPI } from 'arseeding-js'
const instance = await genAPI(window.ethereum)

const arseedUrl = 'your-arseed-service-url'
const data = Buffer.from('........')
const payCurrency = 'usdc' // everpay supported all tokens
const ops = {
    tags: [{name: "Content-Type",value:'data type'}]
}
const res = await instance.sendAndPay(arseedUrl, data, payCurrency, ops)
console.log('res',res)

// review data
curl --location --request GET 'https://your-arseed-server/res.order.itemId'
```
