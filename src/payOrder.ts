import Everpay from 'everpay'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
export {
  payOrder,
  payOrders,
  newEverpayByEcc,
  newEverpayByRSA
}

async function payOrder (everpay: Everpay, order: any): Promise<string> {
  const ords = []
  ords.push(order)
  return await payOrders(everpay, ords)
}

async function payOrders (everpay: Everpay, orders: any[]): Promise<string> {
  if (orders.length === 0) {
    return 'No Order Need to Pay'
  }
  const to = orders[0].bundler
  const currency = orders[0].currency
  const decimals = orders[0].decimals
  const ids = []
  let fee = new BigNumber(0)
  for (const ord of orders) {
    ids.push(ord.itemId)
    fee = fee.plus(ord.fee)
  }
  const result = await everpay.transfer({
    amount: fee.dividedBy(new BigNumber(10).pow(decimals)).toString(),
    symbol: currency,
    to: to,
    data: {
      appName: 'arseeding',
      action: 'payment',
      itemIds: ids
    }
  })
  return result.everHash
}

function newEverpayByEcc (eccPrivateKey: string): Everpay {
  const provider = new ethers.providers.InfuraProvider('mainnet')
  const signer = new ethers.Wallet(eccPrivateKey, provider)
  const pay = new Everpay({
    account: signer.address,
    chainType: 'ethereum' as any,
    ethConnectedSigner: signer
  })
  return pay
}

function newEverpayByRSA (arJWK: any, arAddress: string): Everpay {
  const everpay = new Everpay({
    account: arAddress,
    chainType: 'arweave' as any,
    arJWK: arJWK
  })
  return everpay
}
