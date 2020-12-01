import { 
  Avalanche, 
  BinTools, 
  BN,
  Buffer
} from "avalanche"
import {
  AVMAPI,
  KeyChain,
  Tx,
  UnsignedTx,
  UTXOSet
} from "avalanche/dist/apis/avm"
import sleep from '../common/sleep'
import { AVMU } from '../common/interfaces'
import { privKey, toAddress, mstimeout } from '../common/values'
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: KeyChain = xchain.keyChain()
xKeychain.importKey(privKey)
const addressStrings: string[] = xchain.keyChain().getAddressStrings()
const amount: BN = new BN(54321)

const main = async (): Promise<any> => {
  const avmu: AVMU = await xchain.getUTXOs(addressStrings)
  const utxoSet: UTXOSet = avmu.utxos 
  const assetID: Buffer = await xchain.getAVAXAssetID()
  const memoStr: string = "AVM Build Base Tx - AVAX"
  const memo: Buffer = bintools.stringToBuffer(memoStr)
  const unsignedTx: UnsignedTx = await xchain.buildBaseTx(
    utxoSet,
    amount,
    assetID,
    [toAddress],
    addressStrings,
    addressStrings
  )
  // let serialized: any = unsignedTx.serialize("display")
  // console.log(JSON.stringify(serialized))
  // console.log(serialized)
  const tx: Tx = unsignedTx.sign(xKeychain)
  console.log(tx.toBuffer().toString('hex'))
  const txid: string = await xchain.issueTx(tx)
  await sleep(mstimeout)
  const status : string = await xchain.getTxStatus(txid)
  console.log(`${status}! TXID: ${txid}`)
}
  
main()
