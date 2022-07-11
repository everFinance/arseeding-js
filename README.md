# arseeding-js

### Install
```
npm i arseeding-js
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
curl --location --request GET 'https://your-arseed-server/{{res.order.itemId}}'
```

### example2 - node
```ts
import { genNodeAPI } from 'arseeding-js'

const instance = await genNodeAPI('YOUR PRIVATE KEY')
// dev
instance.sendAndPay('https://seed-dev.everpay.io', Buffer.from('aa bb cc'), 'usdc', {}, true)

// prod
instance.sendAndPay('https://seed.everpay.io', Buffer.from('aa bb cc'), 'usdc', {})
```
