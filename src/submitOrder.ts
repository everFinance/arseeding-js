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
  return await submit(cfg.arseedUrl, dataItem, cfg.tag, cfg.apiKey, cfg.needSeq)
}

async function createAndSignItem (signer: Signer, data: Buffer, opts: DataItemCreateOptions): Promise<DataItem> {
  const dataItem = createData(data, signer, opts)
  await dataItem.sign(signer)
  return dataItem
}

async function submit (arseedingUrl: string, dataItem: DataItem, tag: string, apiKey?: string, needSeq?: boolean): Promise<any> {
  const api = axios.create({ baseURL: arseedingUrl })
  const header = {
    'Content-Type': 'application/octet-stream'
  } as any
  if (apiKey !== undefined && apiKey.length > 0) {
    header['X-API-KEY'] = apiKey
  }
  if (needSeq !== undefined && needSeq) {
    header.Sort = 'true'
  }
  const tokenSymbol = tag.split('-')[1]
  const res = await api.post(`/bundle/tx/${tokenSymbol}`, dataItem.getRaw(), {
    headers: header,
    maxBodyLength: Infinity
  })
  return { ...res.data, tag }
}
