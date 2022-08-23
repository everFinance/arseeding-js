import { createData, DataItemCreateOptions } from 'arseeding-arbundles'
import { Signer } from 'arseeding-arbundles/src/signing'
import DataItem from 'arseeding-arbundles/src/DataItem'
import axios from 'axios'
import {submitByApikey} from "./index";
import {Config} from "./types";

export {
  createAndSubmitItem
}

async function createAndSubmitItem ( data: Buffer, opts: DataItemCreateOptions,cfg: Config): Promise<any> {
  const dataItem = await createAndSignItem(cfg.signer, data, opts)
  return await submit(cfg.arseedUrl, dataItem, cfg.currency, cfg.apiKey)
}

async function createAndSignItem (signer: Signer, data: Buffer, opts: DataItemCreateOptions): Promise<DataItem> {
  const dataItem = createData(data, signer, opts)
  await dataItem.sign(signer)
  return dataItem
}

async function submit (arseedingUrl: string, dataItem: DataItem, tokenSymbol: string, apiKey?:string): Promise<any> {
  const api = axios.create({ baseURL: arseedingUrl })
  const res = await api.post(`/bundle/tx/${tokenSymbol}`, dataItem.getRaw(), {
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-API-KEY':apiKey
    },
    maxBodyLength: Infinity,
    timeout:10000
  })
  return res.data
}
