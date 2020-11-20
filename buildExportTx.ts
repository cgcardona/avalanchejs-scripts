// import { Avalanche, BinTools, BN } from "avalanche"
//   import { Buffer } from 'buffer/'
//   import { 
//     AVMAPI, 
//     AVMKeyChain, 
//     Tx, 
//     UnsignedTx,
//     UTXOSet
//   } from "avalanche/dist/apis/avm"
//   import {
//     PlatformVMAPI, 
//     PlatformVMKeyChain,
//   } from "avalanche/dist/apis/platformvm"
//   import { 
//     PlatformChainID,
//   } from "avalanche/dist/utils/constants"

//   // consts
//   const ip: string = "localhost"
//   const port: number = 9650
//   const protocol: string = "http"
//   const networkID: number = 12345
//   const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
//   const amount: BN = new BN(100000000000000)
//   const fee: BN = new BN(5000000)
//   const xchain: AVMAPI = avalanche.XChain()
//   const bintools: BinTools = BinTools.getInstance()
//   const xKeychain: AVMKeyChain = xchain.keyChain()
//   const mypk: Buffer = bintools.cb58Decode("ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
//   xKeychain.importKey(mypk)
//   const xAddresses: Buffer[] = xchain.keyChain().getAddresses()
//   const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
//   const pchain: PlatformVMAPI = avalanche.PChain()
//   const pKeychain: PlatformVMKeyChain = pchain.keyChain()
//   pKeychain.importKey(mypk)
//   const pAddressStrings: string[] = pchain.keyChain().getAddressStrings()
//   xchain.setFee(fee)
//   console.log(xchain.getFee().toString())

//   console.log(xAddressStrings)
//   console.log(pAddressStrings)
  
//   // the goods
//   const main = async (): Promise<any> => {
//     // console.log(pchain.getFee().toString())
//     // return false
//     const utxoSet: UTXOSet = await xchain.getUTXOs(xAddressStrings)
//     const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
//     const memoCB58: string = bintools.cb58Encode(memoBuf)
//     const memo: Buffer = bintools.stringToBuffer(memoCB58)
//     const unsignedTx: UnsignedTx = await xchain.buildExportTx(
//         utxoSet,
//         amount,
//         PlatformChainID,
//         pAddressStrings,
//         xAddressStrings,
//         xAddressStrings,
//         memo
//     )
//     const tx: Tx =  unsignedTx.sign(xKeychain)
//     const txid: string = await xchain.issueTx(tx)
//     console.log(`TXID: ${txid}`)
//   }
  
//   main()