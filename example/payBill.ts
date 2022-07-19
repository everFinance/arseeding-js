import {newEverpayByEcc, payOrder} from "../src/payOrder";

// ts-node ./example/payBill.ts
async function payBill() {
    const eccPrivate = ''
    const orderJs = ''
    const pay = newEverpayByEcc(eccPrivate)
    const order = JSON.parse(orderJs)
    const everHash = await payOrder(pay, order)
    console.log('everHash', everHash)
}
payBill()
