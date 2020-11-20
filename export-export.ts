// import { Avalanche, BinTools, BN, Buffer } from "avalanche"
// import { InfoAPI } from "avalanche/dist/apis/info"
// import { 
//   AVMAPI, 
//   KeyChain as AVMKeyChain,
//   Tx as AVMTx,
//   UTXOSet as AVMUTXOSet,
//   UnsignedTx as AVMUnsignedTx,
// } from "avalanche/dist/apis/avm"

// import {
//   PlatformVMAPI, 
//   KeyChain as PlatformVMKeyChain,
//   Tx as PlatformVMTx,
//   UTXOSet as PlatformVMUTXOSet,
//   UnsignedTx as PlatformVMUnsignedTx,
// } from "avalanche/dist/apis/platformvm"

// const sleep = (ms: number): Promise<unknown> => {
//   return new Promise( resolve => setTimeout(resolve, ms) )
// }

// interface AVMU {
//   numFetched: number
//   utxos: AVMUTXOSet
//   endIndex: {
//     address: string
//     utxo: string
//   }
// }

// interface PlatformVMU {
//   numFetched: number
//   utxos: PlatformVMUTXOSet 
//   endIndex: {
//     address: string
//     utxo: string
//   }
// }

// const ip: string = "localhost"
// const protocol: string = "http"
// const networkID: number = 12345
// const port: number = 9650
// const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
// const bintools: BinTools = BinTools.getInstance()
// const avm: AVMAPI = avalanche.XChain()
// const platformvm: PlatformVMAPI= avalanche.PChain()
// const xKeychain: AVMKeyChain = avm.keyChain()
// const pKeychain: PlatformVMKeyChain = platformvm.keyChain()
// const privKey: string = "PrivateKey-"
// xKeychain.importKey(privKey)
// pKeychain.importKey(privKey)
// const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
// // console.log(xAddressStrings)
// const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()
// let amount: BN = new BN(100000000000000)
// const info: InfoAPI = avalanche.Info()
// const mstimeout: number = 3000

// const main = async (): Promise<any> => {
//   let memoStr: string = "Step 1: Export AVAX from X-Chain"
//   console.log(memoStr)
//   let avmu: AVMU = await avm.getUTXOs([xAddressStrings[0]])
//   let avmUTXOSet: AVMUTXOSet = avmu.utxos 
//   // const amtfee: BN = amount.add(amount).mul(amount)
//   let amtfee: BN = amount.add(avm.getTxFee());
//   let memo: Buffer = bintools.stringToBuffer(memoStr)
//   let avmUnsignedTx: AVMUnsignedTx = await avm.buildExportTx(
//     avmUTXOSet,
//     amount,
//     platformvm.getBlockchainID(),
//     [pAddressStrings[0]],
//     [xAddressStrings[0]],
//     [xAddressStrings[0]],
//     memo
//   )
//   let avmTx: AVMTx = avmUnsignedTx.sign(avm.keyChain())
//   let txid: string = await avm.issueTx(avmTx)
//   await sleep(mstimeout)
//   let status: any = await platformvm.getTxStatus(txid)
//   console.log(`${status}! TXID: ${txid}`)
//   console.log("----------------------------")

//   memoStr = "Step 2: Import AVAX to the P-Chain"
//   console.log(memoStr)
//   let platformvmu: PlatformVMU = await platformvm.getUTXOs([pAddressStrings[0]])
//   let platformVMUTXOSet: PlatformVMUTXOSet = platformvmu.utxos 
//   const avmChainID: string = await info.getBlockchainID("X")
//   memo = bintools.stringToBuffer(memoStr)
//   let platformVMUnsignedTx: PlatformVMUnsignedTx = await platformvm.buildImportTx(
//     platformVMUTXOSet,
//     pAddressStrings,
//     avmChainID,
//     pAddressStrings,
//     pAddressStrings,
//     pAddressStrings,
//     memo
//   )

//   let platformVMTx: PlatformVMTx = platformVMUnsignedTx.sign(platformvm.keyChain())
//   txid = await platformvm.issueTx(platformVMTx)
//   await sleep(mstimeout)
//   status = await platformvm.getTxStatus(txid)
//   if(status === 'Committed') {
//     console.log(`${status}! TXID: ${txid}`)
//   } else {
//     console.log(`${status.status}! TXID: ${txid}`)
//   }
//   console.log("----------------------------")

//   memoStr = "Step 3: Export AVAX from the P-Chain"
//   console.log(memoStr)
//   platformvmu = await platformvm.getUTXOs([pAddressStrings[0]])
//   platformVMUTXOSet = platformvmu.utxos 

//   amtfee = amount.add(platformvm.getTxFee())
//   memo = bintools.stringToBuffer(memoStr)
//   platformVMUnsignedTx = await platformvm.buildExportTx(
//     platformVMUTXOSet,
//     amtfee,
//     avm.getBlockchainID(),
//     [xAddressStrings[0]],
//     [pAddressStrings[0]],
//     [pAddressStrings[0]],
//     memo
//   )
//   platformVMTx = platformVMUnsignedTx.sign(platformvm.keyChain())
//   txid = await platformvm.issueTx(platformVMTx)
//   await sleep(mstimeout)
//   status = await platformvm.getTxStatus(txid)
//   if(status === 'Committed') {
//     console.log(`${status}! TXID: ${txid}`)
//   } else {
//     console.log(`${status.status}! TXID: ${txid}`)
//   }
//   console.log("----------------------------")

//   memoStr = "Step 4: Import AVAX to the X-Chain"
//   console.log(memoStr)
//   avmu = await avm.getUTXOs([xAddressStrings[0]])
//   avmUTXOSet = avmu.utxos 
//   memo = bintools.stringToBuffer(memoStr)
//   const platformvmChainID: string = await info.getBlockchainID("P")
//   memo = bintools.stringToBuffer(memoStr)
//   avmUnsignedTx = await avm.buildImportTx(
//     avmUTXOSet,
//     xAddressStrings,
//     platformvmChainID,
//     xAddressStrings,
//     xAddressStrings,
//     xAddressStrings,
//     memo
//   )

//   avmTx = avmUnsignedTx.sign(avm.keyChain())
//   txid = await avm.issueTx(avmTx)
//   await sleep(mstimeout)
//   status = await avm.getTxStatus(txid)
//   console.log(`${status}! TXID: ${txid}`)
//   console.log("----------------------------")
// }
  
// main()
