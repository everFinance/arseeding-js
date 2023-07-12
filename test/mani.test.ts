import { batchPayOrders, uploadFolder } from '../src/uploadFolder'
import { getTokenTagByEver } from '../src'

const path = './build'
const priv = ''
const url = 'https://arseed.web3infura.io'
const indexFile = ''
test('mani', async () => {
  const tags = await getTokenTagByEver('usdc')
  const { ords, fee, maniId } = await uploadFolder(path, priv, url, tags[0], indexFile)
  const res = await batchPayOrders(ords, priv)
  console.log(ords.length, fee, maniId)
  console.log(res)
})
