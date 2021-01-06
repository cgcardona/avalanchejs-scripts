import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from "avalanche"
import {
  AVMAPI, 
  KeyChain as AVMKeyChain,
  UTXOSet,
  UnsignedTx,
  Tx
} from "avalanche/dist/apis/avm"
import { UnixNow } from "avalanche/dist/utils"
    
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: AVMKeyChain = xchain.keyChain()
const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
xKeychain.importKey(privKey)
const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
const avaxAssetID: string = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"
const asOf: BN = UnixNow()
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = bintools.stringToBuffer("AVM buildBaseTx")
const fee: BN = new BN(1000000)
    
const main = async (): Promise<any> => {
  const b: any = await xchain.getBalance(xAddressStrings[0], avaxAssetID)
  const balance: BN = new BN(b.balance)
  const u: any = await xchain.getUTXOs(xAddressStrings)
  const utxoSet: UTXOSet = u.utxos

  const unsignedTx: UnsignedTx = await xchain.buildBaseTx(
    utxoSet,
    balance.sub(fee),
    bintools.cb58Decode(avaxAssetID),
    xAddressStrings,
    xAddressStrings,
    xAddressStrings,
    memo,
    asOf,
    locktime,
    threshold
  )
  const tx: Tx = unsignedTx.sign(xKeychain)
  const id: string = await xchain.issueTx(tx)
  console.log(id)
}
  
main()
  