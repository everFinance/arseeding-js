import {newEverpayByEcc, PayOrder} from "../src/payOrder";

// ts-node ./example/payBill.ts
async function payBill() {
    const eccPrivate = ''
    const orderJs = ''
    const pay = newEverpayByEcc(eccPrivate)
    const everHash = await PayOrder(pay, orderJs)
    console.log('everHash', everHash)
}
payBill()
