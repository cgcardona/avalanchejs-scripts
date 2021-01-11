import { 
  Avalanche,
  BinTools,
  BN,
  Buffer,
} from "avalanche"
import {
  PlatformVMAPI,
  KeyChain,
  UTXOSet,
  UnsignedTx,
  Tx
} from "avalanche/dist/apis/platformvm"
import { UnixNow } from "avalanche/dist/utils"
import { iPlatformVMUTXOResponse } from "avalanche/dist/apis/platformvm/interfaces"
    
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const pchain: PlatformVMAPI = avalanche.PChain()
const bintools: BinTools = BinTools.getInstance()
const pKeychain: KeyChain = pchain.keyChain()
const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
pKeychain.importKey(privKey)
const pAddressStrings: string[] = pchain.keyChain().getAddressStrings()
const threshold: number = 1
const memo: Buffer = bintools.stringToBuffer("PlatformVM utility method buildCreateSubnetTx to create a new subnet")
const asOf: BN = UnixNow()
 
const main = async (): Promise<any> => {
  const platformVMUTXOResponse: iPlatformVMUTXOResponse = await pchain.getUTXOs(pAddressStrings)
  const utxoSet: UTXOSet = platformVMUTXOResponse.utxos

  const unsignedTx: UnsignedTx = await pchain.buildCreateSubnetTx(
    utxoSet,
    pAddressStrings,
    pAddressStrings,
    pAddressStrings,
    threshold,
    memo,
    asOf
  )

  // start uncomment for codecID 00 00
  const tx: Tx = unsignedTx.sign(pKeychain)
  const id: string = await pchain.issueTx(tx)
  // stop uncomment for codecID 00 00

  // start uncomment for codecID 00 01
  // const codecID: number = 1
  // const tx: Tx = unsignedTx.sign(xKeychain, codecID)
  // const cb58EncodedTx: string = bintools.cb58Encode(tx.toBuffer(codecID))
  // const id: string = await xchain.issueTx(cb58EncodedTx)
  // stop uncomment for codecID 00 01

  console.log(id)
}
  
main()
  