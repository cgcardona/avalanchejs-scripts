import {
  Avalanche,
  BinTools,
  Buffer
} from "avalanche"
import { 
  AVMAPI,
  KeyChain,
  Tx,
  UnsignedTx,
  UTXOSet,
  MinterSet
} from "avalanche/dist/apis/avm"
import sleep from '../common/sleep'
import { AVMU } from '../common/interfaces'
import { privKey, mstimeout } from '../common/values'

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
const name: string = "Non Fungible Token"
const symbol: string = "NFT"
const threshold: number = 1
let minterSet: MinterSet = new MinterSet(threshold, addressStrings)
  
const main = async (): Promise<any> => {
  const avmu: AVMU = await xchain.getUTXOs(addressStrings)
  const utxoSet: UTXOSet = avmu.utxos 
  const memoStr: string = "AVM Build Create NFT Asset Tx"
  const memo: Buffer = bintools.stringToBuffer(memoStr)
  const unsignedTx: UnsignedTx = await xchain.buildCreateNFTAssetTx(
    utxoSet,
    addressStrings,
    addressStrings,
    [minterSet],
    name,
    symbol,
    memo
  )
  const tx: Tx =  unsignedTx.sign(xKeychain)
  const txid: string = await xchain.issueTx(tx)
  await sleep(mstimeout)
  const status : string = await xchain.getTxStatus(txid)
  console.log(`${status}! TXID: ${txid}`)
  console.log("----------------------------")
}
  
main()
