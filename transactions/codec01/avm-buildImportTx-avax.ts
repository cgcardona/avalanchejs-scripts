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
import { iAVMUTXOResponse } from "avalanche/dist/apis/avm/interfaces"
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
// const cChainBlockchainID: string = Defaults.network['12345'].C.blockchainID
const cChainBlockchainID: string = "2Z9cLs2fVMZ5xjBQ8epCqxrVtHMeS1Hp2SXQrv85be7b5KmeQd"
const threshold: number = 1
const locktime: BN = new BN(0)
const asOf: BN = UnixNow()
const memo: Buffer = bintools.stringToBuffer("Import to X-Chain the C-Chain")
      
const main = async (): Promise<any> => {
  const avmUTXOResponse: iAVMUTXOResponse = await xchain.getUTXOs(xAddressStrings, cChainBlockchainID)
  const utxoSet: UTXOSet = avmUTXOResponse.utxos
  
  const unsignedTx: UnsignedTx = await xchain.buildImportTx(
    utxoSet,
    xAddressStrings,
    cChainBlockchainID,
    xAddressStrings,
    xAddressStrings,
    xAddressStrings,
    memo,
    asOf,
    locktime,
    threshold
  )

  // start uncomment for codecID 00 00
  const tx: Tx = unsignedTx.sign(xKeychain)
  const id: string = await xchain.issueTx(tx)
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
    