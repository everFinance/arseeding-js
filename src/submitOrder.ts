import { createData, DataItemCreateOptions } from 'arseeding-arbundles'
import { Signer } from 'arseeding-arbundles/src/signing'
import DataItem from 'arseeding-arbundles/src/DataItem'
import axios from 'axios'
import { Config } from './types'

export {
  createAndSubmitItem
}

async function createAndSubmitItem (data: Buffer, opts: DataItemCreateOptions, cfg: Config): Promise<any> {
  const dataItem = await createAndSignItem(cfg.signer, data, opts)
  return await submit(cfg.arseedUrl, dataItem, cfg.currency, cfg.apiKey)
}

async function createAndSignItem (signer: Signer, data: Buffer, opts: DataItemCreateOptions): Promise<DataItem> {
  const dataItem = createData(data, signer, opts)
  await dataItem.sign(signer)
  return dataItem
}

async function submit (arseedingUrl: string, dataItem: DataItem, tokenSymbol: string, apiKey?: string): Promise<any> {
  const api = axios.create({ baseURL: arseedingUrl })
  let header = {
    'Content-Type': 'application/octet-stream'
  } as any
  if (apiKey != null) {
    header = {
      'Content-Type': 'application/octet-stream',
      'X-API-KEY': apiKey
    }
  }
  const res = await api.post(`/bundle/tx/${tokenSymbol}`, dataItem.getRaw(), {
    headers: header,
    maxBodyLength: Infinity
  })
  return res.data
}
