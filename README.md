# arseeding-js
```ts
import { genAPI } from 'arseeding-js'
const instance = await genAPI(window.ethereum)

// dev
instance.sendAndPay('https://seed.dev.everpay.io', Buffer.from('aa bb cc'), 'usdc', {}, true)

// prod
instance.sendAndPay('https://seed.everpay.io', Buffer.from('aa bb cc'), 'usdc', {})
```