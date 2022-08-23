import { genNodeAPI } from '../src/index'

test('send and pay', async () => {
  const instance = genNodeAPI('94c97d4cc865d77afaf2d64147f7c067890e1485eb5d8e2c15cc0b7528a08b47')

  return instance.sendAndPay('https://seed-dev.everpay.io', Buffer.from('aa bb cc'), 'usdc', {}, true)
    .then((result: any) => {
      console.log('result', result)
      expect(result.order).toBeTruthy()
    })
})
