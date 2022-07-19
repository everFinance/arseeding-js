import Everpay from 'everpay'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
export {
  payOrder,
  newEverpayByEcc,
  newEverpayByRSA
}

async function payOrder (everpay: Everpay, order: any): Promise<string> {
  const to = order.bundler
  const fee = order.fee
  const decimals = order.decimals

  const result = await everpay.transfer({
    amount: new BigNumber(fee).dividedBy(new BigNumber(10).pow(decimals)).toString(),
    symbol: order.currency,
    to: to,
    data: order
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

function newEverpayByRSA (arJWK: string, arAddress: string): Everpay {
  const everpay = new Everpay({
    account: arAddress,
    chainType: 'arweave' as any,
    arJWK: arJWK as any
  })
  return everpay
}
