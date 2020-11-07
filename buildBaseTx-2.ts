import { 
  Avalanche, 
  BinTools, 
  BN 
} from "avalanche"
import {
  AVMAPI,
  KeyChain,
  Tx,
  UnsignedTx,
  UTXOSet
} from "avalanche/dist/apis/avm"
import { Buffer } from 'buffer/'

const sleep = (ms: number): Promise<unknown> => {
  return new Promise( resolve => setTimeout(resolve, ms) )
}

interface AVMU {
  numFetched: number
  utxos: UTXOSet
  endIndex: {
    address: string
    utxo: string
  }
}
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: KeyChain = xchain.keyChain()
const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
xKeychain.importKey(privKey)
// const addresses: Buffer[] = xchain.keyChain().getAddresses()
const addressStrings: string[] = xchain.keyChain().getAddressStrings()
const amount: BN = new BN(5)
const mstimeout: number = 3000
const toAaddress: string = "X-local1u90zmd64q33kt50ecl74nt6muag06e3fgwyq4c"
const assetIDStr: string = "2B6dbhqWybMnALwjXESGeVSkUPYnmeRBg2DpCrtkk5KaD1NqcW"
const assetIDBuf: Buffer = bintools.cb58Decode(assetIDStr)
  
const main = async (): Promise<any> => {
  const avmu: AVMU = await xchain.getUTXOs(addressStrings)
  const utxoSet: UTXOSet = avmu.utxos 
  const assetID: Buffer = await xchain.getAVAXAssetID()
  const memoStr: string = "AVM Build Base Tx - SECP Asset"
  const memo: Buffer = bintools.stringToBuffer(memoStr)
  const unsignedTx: UnsignedTx = await xchain.buildBaseTx(
    utxoSet,
    amount,
    assetIDBuf,
    [toAaddress],
    addressStrings,
    addressStrings,
    memo
  )
  const tx: Tx = unsignedTx.sign(xKeychain)
  const txid: string = await xchain.issueTx(tx)
  await sleep(mstimeout)
  const status : string = await xchain.getTxStatus(txid)
  console.log(`${status}! TXID: ${txid}`)
  console.log("----------------------------")
}
  
main()
