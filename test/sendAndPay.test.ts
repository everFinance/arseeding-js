import { genNodeAPI, getTokenTagByEver } from '../src/index'
import { Bundle } from 'arseeding-arbundles-esm'
import { readFileSync } from 'fs'

test('send and pay', async () => {
  const instance = genNodeAPI('')
  const tags = await getTokenTagByEver('usdc') // 获取 usdc 的所有 tag
  return await instance.sendAndPay('https://arseed.web3infra.dev', Buffer.from('aa bb cc'), tags[0], {}, false)
    .then((result: any) => {
      console.log('result', result)
      expect(result.order).toBeTruthy()
    })
})

test('bundle verify', async () => {
  const data = readFileSync('./test/0HD')
  console.log('data length ', data.length)
  const bd = new Bundle(data)
  console.log(bd.getIds())
  const isTrue = await bd.verify()
  console.log(isTrue)
})
