// import { 
//   Avalanche, 
//   BinTools, 
//   BN,
//   Buffer
// } from "avalanche"
// import { InfoAPI } from "avalanche/dist/apis/info"
// import {
//   AVMAPI,
//   KeyChain as AVMKeyChain,
// } from "avalanche/dist/apis/avm"
// import {
//   EVMAPI,
//   KeyChain as EVMKeyChain,
//   Tx,
//   UnsignedTx,
//   UTXOSet,
//   SECPTransferInput,
//   SECPTransferOutput,
//   TransferableInput,
//   TransferableOutput,
//   EVMInpu
// } from "avalanche/dist/apis/evm"
// import sleep from '../common/sleep'
// import { EVMU } from '../common/interfaces'
// import { privKey, toAddress, mstimeout } from '../common/values'

// let evmInput = new EVMInpu()
// console.log(evmInput)

  
// const ip: string = "localhost"
// const port: number = 9650
// const protocol: string = "http"
// const networkID: number = 12345
// const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
// const xchain: AVMAPI = avalanche.XChain()
// const cchain: EVMAPI = avalanche.CChain()
// const info: InfoAPI = avalanche.Info()
// const bintools: BinTools = BinTools.getInstance()
// const cKeychain: EVMKeyChain = cchain.keyChain()
// const xKeychain: AVMKeyChain = xchain.keyChain()
// cKeychain.importKey(privKey)
// xKeychain.importKey(privKey)
// const cAddressStrings: string[] = cchain.keyChain().getAddressStrings()
// const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
  
// const main = async (): Promise<any> => {
//   return false
//   const evmu: EVMU = await cchain.getUTXOs(cAddressStrings, "X")
//   const utxoSet: UTXOSet = evmu.utxos 
//   // const assetID: Buffer = await cchain.getAVAXAssetID(12345)
//   const blockchainID: string = await info.getBlockchainID("X") 
//   const memoStr: string = "AVM Build Import Tx - AVAX"
//   const memo: Buffer = bintools.stringToBuffer(memoStr)
//   const unsignedTx: UnsignedTx = await cchain.buildImportTx(
//     utxoSet,
//     cAddressStrings,
//     blockchainID,
//     cAddressStrings,
//     cAddressStrings,
//     cAddressStrings,
//     memo
//   )
//   const tx: Tx = unsignedTx.sign(cKeychain)
//   console.log(tx.toBuffer().toString('hex'))
//   const txid: string = await cchain.issueTx(tx)
//   await sleep(mstimeout)
//   const status : string = await cchain.getTxStatus(txid)
//   console.log(`${status}! TXID: ${txid}`)
//   console.log("----------------------------")
// }
  
// main()
