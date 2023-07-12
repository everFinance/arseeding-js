import Everpay, { ChainType } from 'everpay'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
export {
  payOrder,
  payOrders,
  newEverpayByEcc,
  newEverpayByRSA
}

const payOrder = async (everpay: Everpay, order: any): Promise<string> => {
  const ords = []
  ords.push(order)
  return await payOrders(everpay, ords)
}

const payOrders = async (everpay: Everpay, orders: any[]): Promise<string> => {
  if (orders.length === 0) {
    return 'No Order Need to Pay'
  }
  const order = orders[0]
  const { paymentStatus = '', paymentId = '', onChainStatus = '' } = order
  if (paymentStatus === 'paid' && paymentId.length > 0) {
    if (onChainStatus !== 'success') {
      return 'The order has been paid for and is waiting to be uploaded'
    }
    return 'The order has been paid for and the upload was successful'
  }
  const to = order.bundler
  const tag = order.tag
  const decimals = order.decimals
  const ids = []
  let fee = new BigNumber(0)
  for (const ord of orders) {
    ids.push(ord.itemId)
    fee = fee.plus(ord.fee)
  }
  const result = await everpay.transfer({
    amount: fee.dividedBy(new BigNumber(10).pow(decimals.toString())).toString(),
    tag: tag,
    to: to,
    data: {
      appName: 'arseeding',
      action: 'payment',
      itemIds: ids
    }
  })
  return result.everHash
}

const newEverpayByEcc = (eccPrivateKey: string): Everpay => {
  const provider = new ethers.providers.InfuraProvider('mainnet')
  const signer = new ethers.Wallet(eccPrivateKey, provider)
  const pay = new Everpay({
    account: signer.address,
    chainType: 'ethereum' as ChainType,
    ethConnectedSigner: signer
  })
  return pay
}

const newEverpayByRSA = (arJWK: any, arAddress: string): Everpay => {
  const everpay = new Everpay({
    account: arAddress,
    chainType: 'arweave' as ChainType,
    arJWK: arJWK
  })
  return everpay
}
