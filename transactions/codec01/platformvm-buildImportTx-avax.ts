import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from "avalanche"
import {
  AVMAPI,
  KeyChain as AVMKeyChain,
} from "avalanche/dist/apis/avm"
import {
  PlatformVMAPI,
  KeyChain as PlatformVMKeyChain,
  UTXOSet,
  UnsignedTx,
  Tx
} from "avalanche/dist/apis/platformvm"
import { Defaults, UnixNow } from "avalanche/dist/utils"
import { iPlatformVMUTXOResponse } from "avalanche/dist/apis/platformvm/interfaces"
    
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const pchain: PlatformVMAPI = avalanche.PChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: AVMKeyChain = xchain.keyChain()
const pKeychain: PlatformVMKeyChain = pchain.keyChain()
const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
xKeychain.importKey(privKey)
pKeychain.importKey(privKey)
const pAddressStrings: string[] = pchain.keyChain().getAddressStrings()
const xChainBlockchainID: string = Defaults.network['12345'].X.blockchainID
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = bintools.stringToBuffer("PlatformVM utility method buildImportTx to import AVAX to the P-Chain from the C-Chain")
const asOf: BN = UnixNow()
 
const main = async (): Promise<any> => {
  const platformVMUTXOResponse: iPlatformVMUTXOResponse = await pchain.getUTXOs(pAddressStrings)
  const utxoSet: UTXOSet = platformVMUTXOResponse.utxos

  const unsignedTx: UnsignedTx = await pchain.buildImportTx(
    utxoSet,
    pAddressStrings,
    xChainBlockchainID,
    pAddressStrings,
    pAddressStrings,
    pAddressStrings,
    memo,
    asOf,
    locktime,
    threshold
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
  