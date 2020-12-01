// // imports
// import { Avalanche, BinTools, BN, avm } from "avalanche"
// import { Buffer } from 'buffer/'
// // import { PayloadBase, BINPayload } from "avalanche/dist/utils"
// import {
//   AVMAPI,
//   AVMConstants,
//   AVMKeyChain,
//   MinterSet,
//   InitialStates,
//   SecpOutput,
//   Tx,
//   UnsignedTx,
//   UTXOSet
// } from "avalanche/dist/apis/avm"

// // consts
// const ip: string = "localhost"
// const port: number = 9650
// const protocol: string = "http"
// const networkID: number = 12345
// // const ip: string = "testapi.avax.network"
// // const port: number = 443
// // const protocol: string = "https"
// // const networkID: number = 4
// const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
// const xchain: AVMAPI = avalanche.XChain()
// const bintools: BinTools = BinTools.getInstance()
// const myKeychain: AVMKeyChain = xchain.keyChain()
// // let newAddress = myKeychain.makeKey(); //returns a Buffer for the address
// // console.log(newAddress.getPrivateKeyString())
// // console.log(myKeychain)
// const pk: string = "PrivateKey-SXNvj3NJLa9WtEHgdAByKg1CxmL4bzk6GFB2WYcj8wvX6Y18R"
// const mypk: Buffer = bintools.cb58Decode(pk.split("-")[1])

// // const mypk: Buffer = bintools.cb58Decode("ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
// myKeychain.importKey(mypk)
// const addresses: Buffer[] = xchain.keyChain().getAddresses()
// const addressStrings: string[] = xchain.keyChain().getAddressStrings()
// console.log(addressStrings)
// const fee: BN = new BN(10)
// xchain.setFee(fee)
// const name: string = "Test Token"
// const symbol: string = "TEST"
// const minterSet: MinterSet = new MinterSet(1, addresses)
// const minterSets: MinterSet[] = [minterSet]

// // the goods
// const main = async (): Promise<any> => {
//   const balances = await xchain.getBalance(addressStrings[0], "AVAX")
//   console.log(balances)
//   // return false
//   const utxoSet: UTXOSet = await xchain.getUTXOs(addresses)
//   const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
//   const memoCB58: string = bintools.cb58Encode(memoBuf)
//   const memo: Buffer = bintools.stringToBuffer(memoCB58)
//   const unsignedTx: UnsignedTx = await xchain.buildCreateNFTAssetTx(
//     utxoSet,
//     addressStrings,
//     minterSets,
//     name,
//     symbol,
//     memo
//   )
//   const tx: Tx =  unsignedTx.sign(myKeychain)
//   console.log(tx.toBuffer().toString('hex'))
//   const txid: string = await xchain.issueTx(tx)
//   console.log(`TXID: ${txid}`)
// }

// main()

// // * codec_id: 00 00 
// // * type_id: 00 00 00 01 
// // * network_id: 00 00 00 04 
// // * blockchain_id: 61 25 84 21 39 7c 02 35 bd 6d 67 81 2a 8b 2c 1c f3 39 29 50 0a 7f 69 16 bb 2f c4 ac 64 6a c0 91 
// // * num_xfer_outs: 00 00 00 01 
// // * xfer_outs[0]
// //   * asset_id: 68 70 b7 d6 6a c3 25 40 31 13 79 e5 b5 db ad 28 ec 7e b8 dd bf c8 f4 d6 72 99 eb b4 84 75 90 7a 
// //   * type_id: 00 00 00 07 
// //   * amount: 00 00 00 00 00 98 96 76 
// //   * locktime: 00 00 00 00 00 00 00 00 
// //   * threshold: 00 00 00 01 
// //   * num_addresses: 00 00 00 01 
// //     * addresses[0]: 76 59 fe 01 40 ab 7d 89 54 19 68 6a 2b ea 0f bd 18 36 8d 98 
// // * num_xfer_ins: 00 00 00 01 
// // * xfer_ins[0]
// //   * tx_id: b4 1a 35 65 d9 be 07 66 21 39 db 77 22 2a b8 49 3d 9d 0f dd 16 8d 5f 59 73 52 21 3f 07 82 c0 31 
// //   * utxo_index: 00 00 00 00 
// //   * asset_id: 68 70 b7 d6 6a c3 25 40 31 13 79 e5 b5 db ad 28 ec 7e b8 dd bf c8 f4 d6 72 99 eb b4 84 75 90 7a 
// //   * type_id: 00 00 00 05 
// //   * amount: 00 00 00 00 00 98 96 80 
// //   * num_address_indices: 00 00 00 01 
// //     * address_indices[0]: 00 00 00 00 
// // * len_memo: 00 00 00 1a 
// // * memo: 00 18 31 37 67 52 6e 44 71 69 53 61 41 53 35 58 74 59 71 47 54 54 4d 67 4e 6b 
// // * name_len: 00 0a
// // * name: 54 65 73 74 20 54 6f 6b 65 6e
// // * symbol_len: 00 04
// // * symbol: 54 45 53 54
// // * denomination: 00
// // * initial_state[]
// // * num_initial_state: 00 00 00 01
// //   * initial_state[0]
// //   * fx_id: 00 00 00 01
// //   * outputs[]
// //   * num_outputs: 00 00 00 01
// //     * output_id: 00 00 00 0a (NFT Mint Output) 
// //     * group_id: 00 00 00 00
// //     * locktime: 00 00 00 00 00 00 00 00
// //     * threshold: 00 00 00 01
// //     * addresses[]
// //     * num_addresses: 00 00 00 01
// //       * addresses[0]: 76 59 fe 01 40 ab 7d 89 54 19 68 6a 2b ea 0f bd 18 36 8d 98 
// // * creds[]
// // * num_creds: 00 00 00 01
// //   * credential_type: 00 00 00 09
// //   * sigs[]
// //   * num_sigs: 00 00 00 01
// //     * sig[0]: 4f 10 ca fc 59 89 5f 00 48 75 fb 69 d0 44 36 29 36 45 6b 91 6e ea 34 85 7f c6 13 8e cc 4d 84 d1 3e c3 89 22 dd 31 bc d1 97 36 58 1e ab c9 dd d9 27 d4 02 12 7e 8d 4d ac e0 f9 15 58 6f f0 45 e1 00

