import { Signer } from 'arseeding-arbundles/src/signing'

export interface Manifest {
    manifest: string,
    version: string,
    paths: Record<string, Record<"id", string>>,
    index?: Record<"path", string>
}

export interface Config {
    signer: Signer
    path: string // folder need to upload
    currency: string // USDC,ETH...
    arseedUrl:string // 'https://arseed.web3infura.io'
}