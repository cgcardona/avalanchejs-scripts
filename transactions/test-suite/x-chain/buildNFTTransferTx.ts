import {
  Avalanche,
  BinTools,
  Buffer,
} from "avalanche"
import { 
  AVMAPI,
  KeyChain,
  Tx,
  UnsignedTx,
  UTXOSet,
  AVMConstants
} from "avalanche/dist/apis/avm"
import sleep from '../common/sleep'
import { AVMU } from '../common/interfaces'
import { privKey, mstimeout, toAddress } from '../common/values'
import getUTXOIDs from '../common/getUTXOIDs'

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
const id: string = "vZhFh9EfFrg2rqyNY5KRms2dSqUqnChuMxwSLbv11tZiZ8vHX"
  
const main = async (): Promise<any> => {
  const avmu: AVMU = await xchain.getUTXOs(addressStrings)
  const utxoSet: UTXOSet = avmu.utxos 
  const memoStr: string = "AVM Build Create NFT Mint Tx"
  const memo: Buffer = bintools.stringToBuffer(memoStr)
  const nftTransferOutputUTXOIDs: string[] = getUTXOIDs(utxoSet, id, AVMConstants.NFTXFEROUTPUTID, id)
  console.log(nftTransferOutputUTXOIDs)
  const unsignedTx: UnsignedTx = await xchain.buildNFTTransferTx(
    utxoSet,
    [toAddress],
    addressStrings,
    addressStrings,
    nftTransferOutputUTXOIDs[0],
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
