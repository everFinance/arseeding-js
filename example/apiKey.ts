import axios from "axios";
import { submitByApikey, getTokenTagByEver } from "../src/index"

// ts-node ./example/apiKey.ts
async function useApiKey() {
    const arseedingUrl = 'https://arseed.web3infura.io'
    const apikey = ''
    const tokenTags = await getTokenTagByEver('usdc') // 获取 usdc 的所有 tag
    const data = Buffer.from('aabbccddee')
    const contentType = 'image/png'
    const tags = {'Content-Type':'image/png','a':'aa','b':'bb'}
    const res = await submitByApikey(arseedingUrl,apikey,tokenTags[0], data,contentType, tags)
    console.log(res)
}

useApiKey()
