import getCurrency from 'bundlr-arseeding-client/build/web/currencies'
import { Wallet, providers } from 'ethers'
import Everpay from 'everpay'
import { createData, DataItemCreateOptions } from 'arseeding-arbundles'
import EthereumSigner from 'arseeding-arbundles/src/signing/chains/ethereumSigner'
import BigNumber from 'bignumber.js'
import axios from 'axios'

export const genAPI = async (windowEthereum: any): Promise<any> => {
  await windowEthereum.enable()
  // metamask 签名认证，目的是读取到 public key
  const provider = new providers.Web3Provider(windowEthereum)
  await provider._ready()
  const currencyConfig = getCurrency('ethereum', provider)
  await currencyConfig.ready()
  const signer = await currencyConfig.getSigner()

  return {
    signer,
    async sendAndPay (arseedingUrl: string, data: Buffer, tokenSymbol: string, opts: DataItemCreateOptions, debug?: boolean) {
      // 组装 data 成 bundle Item 并使用 signer 进行 item sign
      const dataItem = createData(
        data,
        signer,
        opts
      )
      await dataItem.sign(signer)

      // 发送组装好的 item 到 arseeding serve
      const api = axios.create({ baseURL: arseedingUrl })
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

export const genNodeAPI = (pk: string): any => {
  const signer = new EthereumSigner(pk)
  const ethConnectedSigner = new Wallet(pk)

  return {
    signer,
    async sendAndPay (arseedingUrl: string, data: Buffer, tokenSymbol: string, opts: DataItemCreateOptions, debug?: boolean) {
      // 组装 data 成 bundle Item 并使用 signer 进行 item sign
      const dataItem = createData(
        data,
        signer,
        opts
      )
      await dataItem.sign(signer)

      // 发送组装好的 item 到 arseeding serve
      const api = axios.create({ baseURL: arseedingUrl })
      const res = await api.post(`/bundle/tx/${tokenSymbol}`, dataItem.getRaw(), {
        headers: { 'Content-Type': 'application/octet-stream' },
        maxBodyLength: Infinity
      })
      const order = res.data
      const { fee, decimals, currency, bundler } = order
      if (+fee > 0) {
        const account = ethConnectedSigner.address
        const everpay = new Everpay({
          debug: debug,
          account: account,
          ethConnectedSigner: ethConnectedSigner,
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

export const getItemMeta = async (arseedingUrl: string, itemId: string): Promise<any> => {
  const api = axios.create({ baseURL: arseedingUrl })
  const res = await api.get(`bundle/tx/${itemId}`)
  return res.data
}

export const getBundleFee = async (arseedingUrl: string, size: string, currency: string): Promise<any> => {
  const api = axios.create({ baseURL: arseedingUrl })
  const res = await api.get(`bundle/fee/${size}/${currency}`)
  return res.data
}

export const getOrders = async (arseedingUrl: string, signerAddr: string): Promise<any> => {
  const api = axios.create({ baseURL: arseedingUrl })
  const res = await api.get(`bundle/orders/${signerAddr}`)
  return res.data
}

export const getDataByGW = async (arseedingUrl: string, itemId: string): Promise<any> => {
  const api = axios.create({ baseURL: arseedingUrl })
  const res = await api.get(`/${itemId}`)
  return res.data
}

export const submitByApikey = async (arseedingUrl: string, apiKey: string, data: Buffer, contentType: string, tags: { [key: string]: string }): Promise<any> => {
  tags['Content-Type'] = contentType
  const api = axios.create({ baseURL: arseedingUrl })
  const res = await api.post('/bundle/data', data, {
    headers: { 'X-API-KEY': apiKey },
    maxBodyLength: Infinity,
    params: tags
  })
  return res.data
}
