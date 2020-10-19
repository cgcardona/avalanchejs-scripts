import { Avalanche, BinTools, BN, Buffer } from "avalanche"
import { 
  AVMAPI, 
  KeyChain as AVMKeyChain, 
} from "avalanche/dist/apis/avm"

const sleep = (ms: number): Promise<unknown> => {
  return new Promise( resolve => setTimeout(resolve, ms) )
}
  
const ip: string = "localhost"
const protocol: string = "http"
const networkID: number = 12345
const port: number = 9650
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const bintools: BinTools = BinTools.getInstance()
const avm: AVMAPI = avalanche.XChain()
const xKeychain: AVMKeyChain = avm.keyChain()
const memo: string = "Through consensus to the stars"
xKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
const xAddresses: Buffer[] = avm.keyChain().getAddresses()
const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
console.log(xAddressStrings)
const username = "gabr13l"
const password = "i224rjEezt" 
const mstimeout: number = 2000;
  
const main = async (): Promise<any> => {

  let avaxAssetID: Buffer = await avm.getAVAXAssetID()
  let address: string = "X-avax1pdurs53v6vtue9sw7am9ayjqh9mcnqe9s80sgn"
  for(let i: number = 0; i < 100; i++) {
    let result: any = await avm.getBalance(address, bintools.cb58Encode(avaxAssetID))
    let balance: BN = new BN(result.balance)
    console.log(balance.toString())
    await sleep(mstimeout)
  }
//   let assetID: string = "AVAX"
//   let result: any = await avm.getBalance(xAddressStrings[0], bintools.cb58Encode(avaxAssetID))
//   let balance: BN = new BN(result.balance)
//   let fee: BN = avm.getTxFee()
//   let avaxAmount: BN = balance.sub(fee)
//   let txid = await avm.sendMultiple(username, password, [{assetID: assetID, amount: avaxAmount, to: xAddressStrings[0]}], xAddresses, xAddressStrings[0], memo)
//   console.log(txid)
}
    
main()
  