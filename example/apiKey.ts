import axios from "axios";

// ts-node ./example/apiKey.ts
async function useApiKey() {
    const arseedingUrl = 'https://arseed.web3infura.io'
    const api = axios.create({ baseURL: arseedingUrl })
    const data = Buffer.from('aabbccddee')
    const tags = {'Content-Type':'image/png','a':'aa','b':'bb'}
    const res = await api.post(`/bundle/data`, data, {
        headers: { 'X-API-KEY': ''},
        maxBodyLength: Infinity,
        params: tags
    })
    console.log('res',res.data)
}

useApiKey()
