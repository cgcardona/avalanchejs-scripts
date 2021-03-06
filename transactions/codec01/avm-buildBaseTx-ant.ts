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
import { 
  iAVMUTXOResponse 
} from "avalanche/dist/apis/avm/interfaces"
import { UnixNow } from "avalanche/dist/utils"
    
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: AVMKeyChain = xchain.keyChain()
const privKey: string = "PrivateKey-2KFKhXh9wPs9PfHC9btUF1n9rGAio2LHXin58j1SJzvWD38qm"
xKeychain.importKey(privKey)
const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
const asOf: BN = UnixNow()
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = bintools.stringToBuffer("AVM utility method buildBaseTx to send an ANT")
    
const main = async (): Promise<any> => {
  const amount: BN = new BN(5)
  const avmUTXOResponse: iAVMUTXOResponse = await xchain.getUTXOs(xAddressStrings)
  const utxoSet: UTXOSet = avmUTXOResponse.utxos
  const assetID: string = "2iM5ZYLkp9ZwZKY12smdeN1gDkXucY2muUUebYMyjTJHMwEYiW"
  const toAddr: string = "X-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u"

  const unsignedTx: UnsignedTx = await xchain.buildBaseTx(
    utxoSet,
    amount,
    assetID,
    [toAddr],
    xAddressStrings,
    xAddressStrings,
    memo,
    asOf,
    locktime,
    threshold
  )

  // start uncomment for codecID 00 00
//   const tx: Tx = unsignedTx.sign(xKeychain)
//   const id: string = await xchain.issueTx(tx)
  // stop uncomment for codecID 00 00

  // start uncomment for codecID 00 01
  const codecID: number = 1
  const tx: Tx = unsignedTx.sign(xKeychain, codecID)
  const cb58EncodedTx: string = bintools.cb58Encode(tx.toBuffer(codecID))
  const id: string = await xchain.issueTx(cb58EncodedTx)
  // stop uncomment for codecID 00 01

  console.log(id)
}
  
main()
  