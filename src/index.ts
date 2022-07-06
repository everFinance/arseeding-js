import getCurrency from 'bundlr-arseeding-client/build/web/currencies'
import { providers } from 'ethers'
import Everpay from 'everpay'
import { createData, DataItemCreateOptions } from 'arseeding-arbundles'
import BigNumber from 'bignumber.js'
import axios from 'axios'

export const genAPI = async (windowEthereum: never): Promise<any> => {
// metamask 签名认证，目的是读取到 public key
  const provider = new providers.Web3Provider(windowEthereum)
  await provider._ready()
  const currencyConfig = getCurrency('ethereum', provider)
  await currencyConfig.ready()
  const signer = await currencyConfig.getSigner()

  return {
    async sendAndPay (arseedingUrl: string, data: Buffer, tokenSymbol: string, opts: DataItemCreateOptions, debug?: boolean) {
      // 组装 data 成 bundle Item 并使用 signer 进行 item sign
      const dataItem = createData(
        data,
        signer,
        opts
      )
      await dataItem.sign(signer)

      // 发送组装好的 item 到 arseeding serve
      const api = await axios.create({ baseURL: arseedingUrl })
      const res = await api.post(`/bundle/tx/${tokenSymbol}`, dataItem.getRaw(), {
        headers: { 'Content-Type': 'application/octet-stream' },
        maxBodyLength: Infinity
      })
      const order = res.data
      const { fee, decimals, currency, bundler } = order
      if (+fee > 0) {
        const accounts = await provider.listAccounts()
        const account = accounts[0] ?? ''
        const everpay = new Everpay({
          debug: debug,
          account: account,
          ethConnectedSigner: provider.getSigner(),
          chainType: 'ethereum' as any
        })

        const result = await everpay.transfer({
          amount: new BigNumber(fee).dividedBy(new BigNumber(10).pow(decimals)).toString(),
          symbol: currency,
          to: bundler,
          data: order
        })

        return {
          ...result,
          order
        }
      } else {
        return {
          order
        }
      }
    }
  }
}
