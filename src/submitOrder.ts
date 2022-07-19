import { createData, DataItemCreateOptions } from 'arseeding-arbundles'
import { Signer } from 'arseeding-arbundles/src/signing'
import DataItem from 'arseeding-arbundles/src/DataItem'
import axios from 'axios'

export {
  createAndSubmitItem
}

async function createAndSubmitItem (arseedingUrl: string, signer: Signer, data: Buffer, opts: DataItemCreateOptions, tokenSymbol: string): Promise<any> {
  const dataItem = await createAndSignItem(signer, data, opts)
  return await submit(arseedingUrl, dataItem, tokenSymbol)
}

async function createAndSignItem (signer: Signer, data: Buffer, opts: DataItemCreateOptions): Promise<DataItem> {
  const dataItem = createData(data, signer, opts)
  await dataItem.sign(signer)
  return dataItem
}

async function submit (arseedingUrl: string, dataItem: DataItem, tokenSymbol: string): Promise<any> {
  const api = axios.create({ baseURL: arseedingUrl })
  const res = await api.post(`/bundle/tx/${tokenSymbol}`, dataItem.getRaw(), {
    headers: { 'Content-Type': 'application/octet-stream' },
    maxBodyLength: Infinity
  })
  return res.data
}
