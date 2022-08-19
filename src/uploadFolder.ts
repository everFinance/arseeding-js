import PromisePool from "@supercharge/promise-pool/dist";
import {createData} from "arseeding-arbundles";
import mime from "mime-types";
import {checkPaths, generateManifest} from "./manifest";
import p from "path";
import EthereumSigner from "arseeding-arbundles/src/signing/chains/ethereumSigner";
import {readFileSync} from "fs";
import {Config} from "./types";
import {createAndSubmitItem} from "./submitOrder";
import {newEverpayByEcc, payOrder} from "./payOrder";
import BigNumber from "bignumber.js";
import {errors} from "ethers";

async function concurrentUploader(cfg:Config, files: string[], concurrency = 10): Promise<{results: Array<any> }> {
    const results = await PromisePool
        .for(files)
        .withConcurrency(concurrency > 50 ? 50 : concurrency)
        .process(async (file) => {
            const ord = await upload(file,cfg)
            const relpath = p.relative(cfg.path, file)
            return { relpath, ord }
        }) as any
    return {results: results.results }
}

// submit item for the file and not pay, return the order
async function upload(file: string, cfg:Config) {
    const data = readFileSync(file)
    const ops = {
        tags: [
            { name: 'ManifestFile', value: file },
            { name: 'Content-Type', value: mime.lookup(file).toString() }
        ]
    }
    return await createAndSubmitItem(cfg.arseedUrl, cfg.signer, data, ops, cfg.currency)
}

// uploadFolder return all orders need to pay
export async function uploadFolder(path:string, privKey:string, url:string, currency:string) {
    const cfg : Config = {
        signer:new EthereumSigner(privKey),
        arseedUrl:url,
        currency:currency,
        path:path
    }
    const files = await checkPaths(path)
    const res = await concurrentUploader(cfg, files, files.length)
    const items = new Map()
    const ords = []
    let totFee = 0
    let decimals = 0
    for(const [_,obj] of res.results.entries()) {
        items.set(obj.relpath, obj.ord.itemId)
        ords.push(obj.ord)
        totFee += +obj.ord.fee
    }
    const mani = generateManifest({items})
    const maniStr = JSON.stringify(mani)

    // upload manifest
    const data = Buffer.from(maniStr)
    const ops = {
        tags: [
            { name: 'Content-Type', value: 'application/x.arweave-manifest+json' }
        ]
    }
    const ord = await createAndSubmitItem(cfg.arseedUrl, cfg.signer, data, ops, cfg.currency)
    decimals = ord.decimals
    const maniId = ord.itemId
    const fee = new BigNumber(totFee).dividedBy(new BigNumber(10).pow(decimals)).toString()
    ords.push(ord)
    return { ords, fee, maniId}
}

// concurrency bug
// export async function batchPay(ords:any[], privKey:string, concurrency = 10) {
//     const everPay = newEverpayByEcc(privKey)
//     const results = await PromisePool
//         .for(ords)
//         .withConcurrency(concurrency > 50 ? 50 : concurrency)
//         .process(async (ord) => {
//             const everHash = await payOrder(everPay, ord)
//             return {everHash}
//         }) as any
//     return {errors: results.errors, results: results.results}
// }

export async function batchPay(ords:any[], privKey:string) {
    const everPay = newEverpayByEcc(privKey)
    const res = []
    for (const ord of ords) {
        const everHash = await payOrder(everPay, ord)
        res.push(everHash)
    }
    return res
}

export async function uploadFolderAndPay(path:string, privKey:string, url:string, currency:string) {
    const {ords, fee} = await uploadFolder(path, privKey, url, currency)
    const res = await batchPay(ords, privKey)
    console.log(res)
}

