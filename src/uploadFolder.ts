import PromisePool from '@supercharge/promise-pool/dist'
import mime from 'mime-types'
import { checkPaths, generateManifest } from './manifest'
import p from 'path'
import EthereumSigner from 'arseeding-arbundles-test/src/signing/chains/ethereumSigner'
import { readFileSync } from 'fs'
import { Config } from './types'
import { createAndSubmitItem } from './submitOrder'
import { newEverpayByEcc, payOrders } from './payOrder'
import BigNumber from 'bignumber.js'

const concurrentUploader = async (cfg: Config, files: string[], concurrency = 10): Promise<{ errors: any[], results: any[] }> => {
  const errors: Error[] = []
  const results = await PromisePool
    .for(files)
    .withConcurrency(concurrency > 50 ? 50 : concurrency)
    .handleError(async (error, _) => {
      errors.push(error)
    })
    .process(async (file, i, _) => {
      try {
        const ord = await upload(file, cfg)
        const relpath = p.relative(cfg.path, file)
        return { relpath, ord }
      } catch (e) {
        throw new Error(file)
      }
    })

  return { errors, results: results.results }
}

// submit item for the file and not pay, return the order
const upload = async (file: string, cfg: Config): Promise<any> => {
  const data = readFileSync(file)
  const ops = {
    tags: [
      { name: 'ManifestFile', value: file },
      { name: 'Content-Type', value: mime.lookup(file).toString() }
    ]
  }
  return await createAndSubmitItem(data, ops, cfg)
}

// uploadFolder return all orders need to pay
export const uploadFolder = async (path: string, privKey: string, arseedUrl: string, tag: string, indexFile?: string, apiKey?: string): Promise<any> => {
  const cfg: Config = {
    signer: new EthereumSigner(privKey),
    arseedUrl: arseedUrl,
    tag: tag,
    path: path,
    apiKey: apiKey
  }
  const files = await checkPaths(path)
  const ords = []
  const { errors, results } = await concurrentUploader(cfg, files, files.length)
  let totFee = 0
  const items = new Map()
  // serial upload timeout files again
  if (errors.length > 0) {
    const sleep = async (ms: number | undefined): Promise<void> => {
      return await new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, ms ?? 0)
      })
    }
    for (const [, file] of errors.entries()) {
      try {
        const ord = await upload(file, cfg)
        ord.tag = tag
        ords.push(ord)
        totFee += +ord.fee
        const relPath = p.relative(cfg.path, file)
        items.set(relPath, ord.itemId)
        await sleep(1500) // it's for upload all folder as much as possible, maybe set sleep longer
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`upload folder fail because network, try again later; err:${e} `)
      }
    }
  }

  let decimals = 0
  for (const [, obj] of results.entries()) {
    items.set(obj.relpath, obj.ord.itemId)
    obj.ord.tag = tag
    ords.push(obj.ord)
    totFee += +obj.ord.fee
  }
  const mani = generateManifest({ items, indexFile })
  const maniStr = JSON.stringify(mani)

  // upload manifest
  const data = Buffer.from(maniStr)
  const ops = {
    tags: [
      { name: 'Content-Type', value: 'application/x.arweave-manifest+json' }
    ]
  }
  const ord = await createAndSubmitItem(data, ops, cfg)
  ord.tag = tag
  totFee += +ord.fee
  decimals = ord.decimals
  const maniId = ord.itemId
  const fee = new BigNumber(totFee).dividedBy(new BigNumber(10).pow(decimals.toString())).toString()
  ords.push(ord)
  return { ords, fee, maniId }
}

export const batchPayOrders = async (ords: any[], privKey: string): Promise<any> => {
  const everPay = newEverpayByEcc(privKey)
  const res = []
  for (let i = 0; i < ords.length; i += 500) {
    let lastIndex
    if ((i + 1) * 500 < ords.length) {
      lastIndex = (i + 1) * 500
    } else {
      lastIndex = ords.length
    }
    const partOrds = ords.slice(i, lastIndex)
    try {
      const everHash = await payOrders(everPay, partOrds)
      res.push(everHash)
    } catch (e: any) {
      throw new Error(e)
    }
  }
  return res
}

export const uploadFolderAndPay = async (path: string, privKey: string, url: string, tag: string, indexFile?: string): Promise<any> => {
  const { ords, fee, maniId } = await uploadFolder(path, privKey, url, tag)
  const everHash = await batchPayOrders(ords, privKey)
  return { fee, maniId, everHash }
}
