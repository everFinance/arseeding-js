import { genNodeAPI } from '../src/index'
import { Bundle } from 'arseeding-arbundles'
import { readFileSync } from 'fs'

test('send and pay', async () => {
  const instance = genNodeAPI('94c97d4cc865d77afaf2d64147f7c067890e1485eb5d8e2c15cc0b7528a08b47')

  return instance.sendAndPay('https://arseed.web3infra.dev', Buffer.from('aa bb cc'), 'vrt', {}, true)
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
