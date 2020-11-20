// import { Avalanche, BinTools, BN } from "avalanche"
// import { Buffer } from 'buffer/'
// import { 
//   AVMAPI, 
//   AVMKeyChain, 
//   Tx, 
//   UnsignedTx,
//   UTXOSet
// } from "avalanche/dist/apis/avm"

// const ip: string = "143.110.143.10"
// const protocol: string = "http"
// const networkID: number = 4
// const port: number = 9650
// const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
// const bintools: BinTools = BinTools.getInstance()
// const avm: AVMAPI = avalanche.XChain()
// const xKeychain: AVMKeyChain = avm.keyChain()
// const memo: Buffer = bintools.stringToBuffer("Avalanche.js")
// xKeychain.importKey("PrivateKey-HxJD7M72GjLh6v8ZjkP8cR46DguXNC9nZCzUk4jC1xCgU535E")
// const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
// const cChainAddress: string = "C-0xc876DF0F099b3eb32cBB78820d39F5813f73E18C"
// const cChainID: string = "saMG5YgNsFxzjz4NMkEkt3bAH6hVxWdZkWcEnGB3Z15pcAmsK"
// const amount: BN = new BN(50000000)

// const main = async (): Promise<any> => {
//   const utxoSet: UTXOSet = await avm.getUTXOs([xAddressStrings[0]])
//   const amtfee: BN = amount.add(avm.getFee());
//   const unsignedTx: UnsignedTx = await avm.buildExportTx(
//     utxoSet,
//     amtfee,
//     cChainID,
//     [cChainAddress],
//     [xAddressStrings[0]],
//     [xAddressStrings[0]],
//     memo
//   )
//   const tx: Tx = unsignedTx.sign(avm.keyChain())
//   const txid: string = await avm.issueTx(tx)
// }
  
// main()

// // * codec_id: 00 00 
// // * type_id: 00 00 00 04
// // * network_id: 00 00 00 04
// // * blockchain_id: 61 25 84 21 39 7c 02 35 bd 6d 67 81 2a 8b 2c 1c f3 39 29 50 0a 7f 69 16 bb 2f c4 ac 64 6a c0 91 

// // * num_xfer_outs: 00 00 00 01
// // * xfer_outs[0]
// // * asset_id: 68 70 b7 d6 6a c3 25 40 31 13 79 e5 b5 db ad 28 ec 7e b8 dd bf c8 f4 d6 72 99 eb b4 84 75 90 7a 
// // * type_id: 00 00 00 07 
// // * amount: 00 00 00 00 05 b8 d8 00 
// // * locktime: 00 00 00 00 00 00 00 00 
// // * threshold: 00 00 00 01 
// // * num_addrs: 00 00 00 01 
// // * addrs[0]: 10 e5 54 db ad 64 84 df bc 0f 99 22 04 ff 76 4d 00 70 e7 ed 

// // * num_xfer_ins: 00 00 00 01 
// // * xfer_ins[0]
// // * tx_id: eb 82 48 0b 15 64 93 13 41 de a1 dc dc da 74 01 9c 60 6d 5c 95 d0 40 c4 13 ba fe 97 06 62 b8 5a 
// // * utxo_index: 00 00 00 00 
// // * asset_id: 68 70 b7 d6 6a c3 25 40 31 13 79 e5 b5 db ad 28 ec 7e b8 dd bf c8 f4 d6 72 99 eb b4 84 75 90 7a 
// // * type_id: 00 00 00 05 
// // * amount: 00 00 00 00 05 f5 e1 00 
// // * num_addr_indx: 00 00 00 01 
// // * addr_indx: 00 00 00 00 

// // * len_memo: 00 00 00 0e 
// // * memo: 00 0c 41 76 61 6c 61 6e 63 68 65 2e 6a 73 

// // * destination_chain: 72 d6 31 ce 46 2c 54 ce e7 bc c5 e5 bb 0b 46 f2 57 32 63 e1 90 64 5e c3 90 28 b7 9f 7f 65 ea cf 

// // * num_export_outs: 00 00 00 01 
// // * export_outs[0]  
// // * asset_id: 68 70 b7 d6 6a c3 25 40 31 13 79 e5 b5 db ad 28 ec 7e b8 dd bf c8 f4 d6 72 99 eb b4 84 75 90 7a 
// // * type_id: 00 00 00 07 
// // * amount: 00 00 00 00 00 2d c6 c0 
// // * locktime: 00 00 00 00 00 00 00 00 
// // * threshold: 00 00 00 01 
// // * num_addrs: 00 00 00 01 
// // * addrs[0]: c8 76 df 0f 09 9b 3e b3 2c bb 78 82 0d 39 f5 81 3f 73 e1 8c 

// // * num_creds: 00 00 00 01 
// // * type_id: 00 00 00 09 
// // * num_sig: 00 00 00 01 
// // * sig[0]: 8d 95 07 0c 34 06 07 f3 51 7a e4 e4 35 1b dd 7c 44 20 94 b1 dc ab 42 a7 13 74 08 25 99 c8 f0 ef 28 79 2c e4 18 14 be 7b 0a 06 94 c4 e8 cb 89 4a 8a 4b 87 81 f9 a2 37 ff 48 ec a3 f5 9e ca 8a b8 01

