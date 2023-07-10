import { submitByApikey, getTokenTagByEver } from '../src/index'

// ts-node ./example/apiKey.ts
async function useApiKey () {
  const arseedingUrl = 'https://arseed.web3infura.io'
  const apikey = ''
  const tokenTags = await getTokenTagByEver('usdc') // 必需是 apiKey 所拥有的 symbol 才可以
  const data = Buffer.from('aabbccddee')
  const contentType = 'image/png'
  const tags = { 'Content-Type': 'image/png', a: 'aa', b: 'bb' }
  const res = await submitByApikey(arseedingUrl, apikey, tokenTags[0], data, contentType, tags)
  console.log(res)
}

useApiKey()
