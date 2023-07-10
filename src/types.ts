import { DataItemCreateOptions } from 'arseeding-arbundles-esm'
import { InjectedArweaveSigner, InjectedEthereumSigner, Signer } from 'arseeding-arbundles-esm/src/signing'
import EthereumSigner from 'arseeding-arbundles-esm/src/signing/chains/ethereumSigner'
export interface Manifest {
  manifest: string
  version: string
  paths: Record<string, Record<'id', string>>
  index?: Record<'path', string>
}

export interface Config {
  signer: Signer
  path: string // folder need to upload
  tag: string // chainType-symbol-tokenid
  arseedUrl: string // 'https://arseed.web3infura.io'
  apiKey?: string
  needSeq?: boolean
}
export interface GenAPIReturn {
  signer: InjectedEthereumSigner
  sendAndPay: (arseedingUrl: string, data: Buffer, tag: string, opts: DataItemCreateOptions, needSeq?: boolean, debug?: boolean) => Promise<{everHash?: string, order: any}>
}
export interface GenArweaveAPIReturn {
  signer: InjectedArweaveSigner
  sendAndPay: (arseedingUrl: string, data: Buffer, tag: string, opts: DataItemCreateOptions, needSeq?: boolean, debug?: boolean) => Promise<{everHash?: string, order: any}>
}

export interface GenNodeAPIReturn {
  signer: EthereumSigner
  sendAndPay: (arseedingUrl: string, data: Buffer, tag: string, opts: DataItemCreateOptions, debug?: boolean) => Promise<{everHash?: string, order: any}>
}
