import getCurrency from '@bundlr-network/client/build/web/currencies';
import { providers } from 'ethers';
import Everpay from 'everpay';
import { createData } from 'arbundles';
import Crypto from 'crypto';
import axios from 'axios';
export const sendAndPay = async (arseedingUrl, windowEthereum, data, tokenSymbol) => {
    var _a;
    // metamask 签名认证，目的是读取到 public key
    const provider = new providers.Web3Provider(windowEthereum);
    await provider._ready();
    const currencyConfig = getCurrency('ethereum', provider);
    await currencyConfig.ready();
    const signer = await currencyConfig.getSigner();
    // 组装 data 成 bundle Item 并使用 signer 进行 item sign
    const dataItem = createData(data, signer, { anchor: Crypto.randomBytes(32).toString('base64').slice(0, 32) });
    await dataItem.sign(signer);
    // 发送组装好的 item 到 arseeding serve
    const api = await axios.create({ baseURL: arseedingUrl });
    const res = await api.post(`/bundle/tx/${tokenSymbol}`, dataItem.getRaw(), {
        headers: { 'Content-Type': 'application/octet-stream' },
        maxBodyLength: Infinity
    });
    const { fee, decimals, currency, bundler } = res.data;
    const accounts = await provider.listAccounts();
    const account = (_a = accounts[0]) !== null && _a !== void 0 ? _a : '';
    const everpay = new Everpay({
        account: account,
        ethConnectedSigner: provider.getSigner(),
        chainType: 'ethereum'
    });
    everpay.transfer({
        amount: symbol, currency,
        to: bundler,
    });
};
