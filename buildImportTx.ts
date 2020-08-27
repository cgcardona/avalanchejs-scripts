// * codec_id: 00 00 
// * type_id: 00 00 00 11 
// * network_id: 00 00 30 39 
// * blockchain_id: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 
// * xfer_outs[]
// * num_xfer_outs: 00 00 00 01 
//   * xfer_outs[0]
//   * asset_id: 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
//   * secp_xfer_output
//   * output_id: 00 00 00 07 
//   * amount: 00 11 c3 79 37 d1 3d c0 
//   * locktime: 00 00 00 00 00 00 00 00 
//   * threshold: 00 00 00 01 
//   * addresses[]
//   * addresses: 00 00 00 01 
//     * addresses[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 
// * xfer_ins[]
// * num_xfer_ins: 00 00 00 01 
//   * xfer_ins[0]
//   * tx_id: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 
//   * utxo_index: 00 00 00 00 
//   * asset_id: 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
//   * secp_xfer_input
//   * output_id: 00 00 00 05 
//   * amount: 00 11 c3 79 37 e0 80 00 
//   * address_indices[]
//   * num_address_indices: 00 00 00 01 
//     * address_indices[0]: 00 00 00 00 
// * len_memo: 00 00 00 1a 
// * memo: 00 18 31 37 67 52 6e 44 71 69 53 61 41 53 35 58 74 59 71 47 54 54 4d 67 4e 6b 
// * source_chain: 78 7c d3 24 3c 00 2e 9b f5 bb ba ea 8a 42 a1 6c 1a 19 cc 10 50 47 c6 69 96 80 7c bf 16 ac ee 10 
// * imported_inputs[]
// * num_imported_inputs: 00 00 00 01 
//   * imported_inputs[0]
//   * tx_id: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 
//   * utxo_index: 00 00 00 00 
//   * asset_id: 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
//   * secp_xfer_input
//   * input_id: 00 00 00 05 
//   * amount: 00 11 c3 79 37 e0 80 00 
//   * address_indices[]
//   * num_address_indices: 00 00 00 01 
//     * address_indices[0]: 00 00 00 00 
// * creds[]
// * num_creds: 00 00 00 02 
//   * creds[0]
//   * type_id: 00 00 00 09 
//   * sigs[]
//   * num_sigs: 00 00 00 01 
//     * sigs[0]: 92 a8 db 4e 5e 54 8f d9 49 e5 eb d9 20 d1 0e 02 9c c1 0a 43 e6 78 46 c7 2b d6 ea e7 13 91 5c fd 39 6d 45 69 6d d3 27 3c 31 70 02 22 aa 24 c7 e0 ac c7 6a b3 d3 85 29 0e 2a 45 be fc a9 e5 c1 96 00 
//   * creds[1]
//   * type_id: 00 00 00 09 
//   * sigs[]
//   * num_sigs: 00 00 00 01 
//     * sigs[1]: 92 a8 db 4e 5e 54 8f d9 49 e5 eb d9 20 d1 0e 02 9c c1 0a 43 e6 78 46 c7 2b d6 ea e7 13 91 5c fd 39 6d 45 69 6d d3 27 3c 31 70 02 22 aa 24 c7 e0 ac c7 6a b3 d3 85 29 0e 2a 45 be fc a9 e5 c1 96 00 
// imports
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
    const utxoSet: UTXOSet = await pchain.getUTXOs(addresses)
    const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
    const memoCB58: string = bintools.cb58Encode(memoBuf)
    const memo: Buffer = bintools.stringToBuffer(memoCB58)
    const unsignedTx: UnsignedTx = await pchain.buildImportTx(
      utxoSet,
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
