import {newEverpayByEcc, newEverpayByRSA, payOrder} from "../src/payOrder";
import { getOrders, getTokenTagByEver } from '../src'
// ts-node ./example/payBill.ts
async function payBill() {
    const eccPrivate = 'private key'
    const arseedingUrl = 'https://arseed.web3infra.dev'
    const address = ''
    // 通过 getOrders 获取该地址所有的 order
    const orders = await getOrders(arseedingUrl, address)
    const everpay = newEverpayByEcc(eccPrivate)
    // 由于 order 中并未包含 tag 字段，所以需要通过 currency 来确定付费的 tag
    const tag = getTokenTagByEver(orders[0].currency)
    const everHash = await payOrder(everpay, {...orders[0],tag})
    console.log('everHash', everHash)
}
payBill()
