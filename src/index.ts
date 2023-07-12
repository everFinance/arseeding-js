import { Wallet, providers } from 'ethers'
import Everpay, { ChainType } from 'everpay'
import { createData, DataItemCreateOptions } from 'arseeding-arbundles'
import EthereumSigner from 'arseeding-arbundles/src/signing/chains/ethereumSigner'
import axios from 'axios'
import { payOrder } from './payOrder'
import { InjectedEthereumSigner, InjectedArweaveSigner } from 'arseeding-arbundles/src/signing'
import { GenAPIReturn, GenArweaveAPIReturn, GenNodeAPIReturn } from './types'
import ArweaveSigner from 'arseeding-arbundles/src/signing/chains/ArweaveSigner'

export const genAPI = async (windowEthereum: any): Promise<GenAPIReturn> => {
  await windowEthereum.request({ method: 'eth_requestAccounts' })
  const provider = new providers.Web3Provider(windowEthereum)
  await provider._ready()
  const signer = new InjectedEthereumSigner(provider)
  await signer.setPublicKey()

  return {
    signer,
    async sendAndPay (arseedingUrl: string, data: Buffer, tag: string, opts: DataItemCreateOptions, needSeq?: boolean, debug?: boolean) {
      const dataItem = createData(
        data,
        signer,
        opts
      )
      await dataItem.sign(signer)

      const api = axios.create({ baseURL: arseedingUrl })
      const header = {
        'Content-Type': 'application/octet-stream'
      } as any
      if (needSeq !== undefined && needSeq) {
        header.Sort = 'true'
      }
      const tokenSymbol = tag.split('-')[1]
      const res = await api.post(`/bundle/tx/${tokenSymbol}`, dataItem.getRaw(), {
        headers: header,
        maxBodyLength: Infinity
      })
      const order = { ...res.data, tag }
      const { fee } = order
      if (+fee > 0) {
        const accounts = await provider.listAccounts()
        const account = accounts[0] ?? ''
        const everpay = new Everpay({
          debug: debug,
          account: account,
          ethConnectedSigner: provider.getSigner(),
          chainType: 'ethereum' as ChainType
        })
        const everHash = await payOrder(everpay, order)

        return {
          everHash,
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

const isString = (obj: any): boolean => {
  return Object.prototype.toString.call(obj) === '[object String]'
}

const checkArPermissions = async (windowArweaveWallet: any, permissions: string[] | string): Promise<void> => {
  let existingPermissions: string[] = []
  const checkPermissions = isString(permissions) ? [permissions] : permissions as string[]

  try {
    existingPermissions = await windowArweaveWallet.getPermissions()
  } catch {
    throw new Error('PLEASE_INSTALL_ARCONNECT')
  }

  if (checkPermissions.length === 0) {
    return
  }
  const checkFunc = (permission: string): boolean => {
    return !existingPermissions.includes(permission)
  }

  if (checkPermissions.some(checkFunc as any)) {
    await windowArweaveWallet.connect(checkPermissions as never[])
  }
}

export const genArweaveAPI = async (windowArweaveWallet: any): Promise<GenArweaveAPIReturn> => {
  await checkArPermissions(windowArweaveWallet, [
    'ACCESS_ADDRESS',
    'ACCESS_ALL_ADDRESSES',
    'ACCESS_PUBLIC_KEY',
    'SIGN_TRANSACTION',
    'SIGNATURE'
  ])
  const signer = new InjectedArweaveSigner(windowArweaveWallet)
  await signer.setPublicKey()

  return {
    signer,
    async sendAndPay (arseedingUrl: string, data: Buffer, tag: string, opts: DataItemCreateOptions, needSeq?: boolean, debug?: boolean) {
      const dataItem = createData(
        data,
        signer,
        opts
      )
      await dataItem.sign(signer)

      const api = axios.create({ baseURL: arseedingUrl })
      const header = {
        'Content-Type': 'application/octet-stream'
      } as any
      if (needSeq !== undefined && needSeq) {
        header.Sort = 'true'
      }
      const tokenSymbol = tag.split('-')[1]
      const res = await api.post(`/bundle/tx/${tokenSymbol}`, dataItem.getRaw(), {
        headers: header,
        maxBodyLength: Infinity
      })
      const order = { ...res.data, tag }
      const { fee } = order
      if (+fee > 0) {
        const account = await windowArweaveWallet.getActiveAddress()
        const everpay = new Everpay({
          debug: debug,
          account: account,
          arJWK: 'use_wallet',
          chainType: 'arweave' as ChainType
        })
        const everHash = await payOrder(everpay, order)

        return {
          everHash,
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

export const genNodeAPI = (pk: string): GenNodeAPIReturn => {
  const signer = new EthereumSigner(pk)
  const ethConnectedSigner = new Wallet(pk)

  return {
    signer,
    async sendAndPay (arseedingUrl: string, data: Buffer, tag: string, opts: DataItemCreateOptions, debug?: boolean) {
      const dataItem = createData(
        data,
        signer,
        opts
      )
      await dataItem.sign(signer)

      const api = axios.create({ baseURL: arseedingUrl })
      const tokenSymbol = tag.split('-')[1]
      const res = await api.post(`/bundle/tx/${tokenSymbol}`, dataItem.getRaw(), {
        headers: { 'Content-Type': 'application/octet-stream' },
        maxBodyLength: Infinity
      })
      const order = { ...res.data, tag }
      const { fee } = order
      if (+fee > 0) {
        const account = ethConnectedSigner.address
        const everpay = new Everpay({
          debug: debug,
          account: account,
          ethConnectedSigner: ethConnectedSigner,
          chainType: 'ethereum' as ChainType
        })

        const everHash = await payOrder(everpay, order)

        return {
          everHash,
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

export const submitByApikey = async (arseedingUrl: string, apiKey: string, tag: string, data: Buffer, contentType: string, tags: { [key: string]: string }): Promise<any> => {
  const currency = tag.split('-')[1]
  tags['Content-Type'] = contentType
  const api = axios.create({ baseURL: arseedingUrl })
  const res = await api.post(`/bundle/data/${currency}`, data, {
    headers: { 'X-API-KEY': apiKey },
    maxBodyLength: Infinity,
    params: tags
  })
  return res.data
}
export const getTokenTagByEver = async (symbol: string, debug?: boolean): Promise<string[]> => {
  const info = await new Everpay({
    debug: debug
  }).info()

  const tags = info.tokenList.map((item) => {
    if (item.symbol.toLowerCase() === symbol.toLowerCase()) {
      return item.tag
    }
    return undefined
  }).filter(Boolean) as string[]
  return tags
}
export { EthereumSigner, ArweaveSigner, InjectedArweaveSigner, InjectedEthereumSigner }
