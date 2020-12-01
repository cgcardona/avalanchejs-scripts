// import { Avalanche, BinTools, BN } from "avalanche"
// import { Buffer } from 'buffer/'
// import { UnixNow } from 'avalanche/dist/utils';
// import { 
//   AVMAPI, 
//   AVMKeyChain
// } from "avalanche/dist/apis/avm"
// import {
//   PlatformVMAPI, 
//   PlatformVMKeyChain,
//   PlatformVMConstants,
//   Tx, 
//   UnsignedTx,
//   UTXOSet
// } from "avalanche/dist/apis/platformvm";

// // consts
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
// const memo: Buffer = bintools.stringToBuffer("Avalanche.js")
// xKeychain.importKey("PrivateKey-")
// pKeychain.importKey("PrivateKey-")
// const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()
// console.log(pAddressStrings)

// const startTime: BN = UnixNow().add(new BN(60)); //60 seconds from now
// const endTime: BN = startTime.add(new BN(60 * 60 * 24 * 14))
// const stakeAmount: BN = PlatformVMConstants.MINSTAKE;

// const main = async (): Promise<any> => {
//   const utxoSet: UTXOSet = await platformvm.getUTXOs([pAddressStrings[0]])
//   const nodeID: string = "NodeID-MYUmR31tU1HBo9sXaqi7ezDEyY9a7AMCg";
//   const unsignedTx: UnsignedTx = await platformvm.buildAddValidatorTx(
//     utxoSet,
//     pAddressStrings,
//     pAddressStrings,
//     nodeID,
//     startTime,
//     endTime,
//     stakeAmount,
//     pAddressStrings,
//     0.01,
//     new BN(0),
//     1,
//     memo
//   )
//   const tx:Tx =  unsignedTx.sign(platformvm.keyChain())
//   // console.log(tx.toBuffer().toString('hex'))
//   const txid: string = await platformvm.issueTx(tx)
//   console.log(txid)
// }
  
// main()



// // 00 00 
// // 00 00 00 0c 
// // 00 00 30 39 
// // 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 

// // 00 00 00 01 
// // 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
// // 00 00 00 07 
// // 00 11 c1 a7 8e 87 1d c0 
// // 00 00 00 00 00 00 00 00 
// // 00 00 00 01 
// // 00 00 00 01 
// // 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 

// // 00 00 00 01 
// // 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 
// // 00 00 00 00 
// // 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
// // 00 00 00 05 
// // 00 11 c3 79 37 e0 80 00 
// // 00 00 00 01 
// // 00 00 00 00 

// // 00 00 00 0e 
// // 00 0c 41 76 61 6c 61 6e 63 68 65 2e 6a 73 

// // e1 56 96 93 46 70 8c 0c 02 4a 55 ea d4 61 a8 8d 64 96 ec 71 

// // 00 00 00 00 5f 55 18 84 
// // 00 00 00 00 5f 67 8d 84 
// // 00 00 01 d1 a9 4a 20 00 

// // 00 00 00 01 
// // 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
// // 00 00 00 07 
// // 00 00 01 d1 a9 4a 20 00 
// // 00 00 00 00 00 00 00 00 
// // 00 00 00 01 
// // 00 00 00 01 
// // 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 

// // 00 00 00 0b 
// // 00 00 00 00 00 00 00 00 
// // 00 00 00 01 
// // 00 00 00 01 
// // 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 

// // 00 00 00 64 

// // 00 00 00 01 
// // 00 00 00 09 
// // 00 00 00 01 
// // bf ae be 9e 84 6b 3f 5e ce 4a 19 a1 8d 8c b3 b3 6d e2 5b d0 eb 74 dc 3f d6 6f 67 b9 8f b9 a4 86 67 0b 22 e1 62 ac ed 0a a0 19 e8 df d2 20 09 5f 73 15 8a 1d aa 40 91 c5 b8 ee 4b 4e f2 ce 3f 24 01

