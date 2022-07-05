# arseeding-js
```ts
import { genAPI } from 'arseeding-js'
const instance = await genAPI(window.ethereum)
instance.sendAndPay('https://seed.dev.everpay.io', Buffer.from('aa bb cc'), 'usdc')
```