import {
  Avalanche,
  BinTools,
  Buffer,
  BN
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
import { privKey, mstimeout } from '../common/values'
import { OutputOwners } from "avalanche/dist/common"
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
const addresses: Buffer[] = xchain.keyChain().getAddresses()
const addressStrings: string[] = xchain.keyChain().getAddressStrings()
const locktime: BN = new BN(0)
const threshold: number = 1
const id: string = "2sS6f48ZRQmbiZutfCarVGwBZE7ggdM68LswMfAhXKbQJSB1Pd"
  
const main = async (): Promise<any> => {
  const avmu: AVMU = await xchain.getUTXOs(addressStrings)
  const utxoSet: UTXOSet = avmu.utxos 
  const memoStr: string = "AVM Build Create NFT Mint Tx"
  const memo: Buffer = bintools.stringToBuffer(memoStr)
  const outputOwners: OutputOwners = new OutputOwners(addresses, locktime, threshold)
  const groupID: number = 0
  const nftMintOutputUTXOIDs: string[] = getUTXOIDs(utxoSet, id, AVMConstants.NFTMINTOUTPUTID, id)
  console.log(nftMintOutputUTXOIDs)
  const unsignedTx: UnsignedTx = await xchain.buildCreateNFTMintTx(
    utxoSet,
    outputOwners,
    addressStrings,
    addressStrings,
    nftMintOutputUTXOIDs[0],
    groupID,
    memo,
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
