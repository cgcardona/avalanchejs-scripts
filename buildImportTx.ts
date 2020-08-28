import { Avalanche, BinTools, BN } from "avalanche"
import { Buffer } from 'buffer/'
import { 
  AVMAPI, 
  AVMKeyChain, 
} from "avalanche/dist/apis/avm"
import {
  PlatformVMAPI, 
  PlatformVMKeyChain,
  Tx, 
  UnsignedTx,
  UTXOSet
} from "avalanche/dist/apis/platformvm"
// import { 
//   PlatformChainID,
// } from "avalanche/dist/utils/constants"

// consts
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const pchain: PlatformVMAPI = avalanche.PChain()
const bintools: BinTools = BinTools.getInstance()
const xchain: AVMAPI = avalanche.XChain()
const xKeychain: AVMKeyChain = xchain.keyChain()
const xpk: Buffer = bintools.cb58Decode("ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
xKeychain.importKey(xpk)
const xAddresses: Buffer[] = xchain.keyChain().getAddresses()
const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
console.log(xAddressStrings)
const pKeychain: PlatformVMKeyChain = pchain.keyChain()
const mypk: Buffer = bintools.cb58Decode("ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
pKeychain.importKey(mypk)
const addresses: Buffer[] = pchain.keyChain().getAddresses()
const addressStrings: string[] = pchain.keyChain().getAddressStrings()
console.log(addressStrings)
const avmChainID: string = "v4hFSZTNNVdyomeMoXa77dAz4CdxU3cziSb45TB7mfXUmy7C7"

// the goods
const main = async (): Promise<any> => {
  const utxoSet: UTXOSet = await pchain.getUTXOs([...addressStrings])
  console.log(utxoSet.getBalance(addresses, await pchain.getAVAXAssetID()).toString(10) , pchain.getFee().toString(10), utxoSet.getAllUTXOStrings())
  // return false
  const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
  const memoCB58: string = bintools.cb58Encode(memoBuf)
  const memo: Buffer = bintools.stringToBuffer(memoCB58)
  const unsignedTx: UnsignedTx = await pchain.buildImportTx(
    utxoSet,
    addressStrings,
    xAddressStrings,
    avmChainID,
    memo
  )
  const tx: Tx =  unsignedTx.sign(pKeychain)
  console.log(tx.toBuffer().toString('hex'))
  const txid: string = await pchain.issueTx(tx)
  console.log(`TXID: ${txid}`)
}

main()