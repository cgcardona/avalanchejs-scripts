  // * codec_id: 00 00 
  // * type_id: 00 00 00 04 
  // * network_id: 00 00 30 39 
  // * blockchain_id: 78 7c d3 24 3c 00 2e 9b f5 bb ba ea 8a 42 a1 6c 1a 19 cc 10 50 47 c6 69 96 80 7c bf 16 ac ee 10 
  // * xfer_outs[]
  // * num_xfer_outs: 00 00 00 01 
  // * xfer_outs[0]
  //   * asset_id: 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
  //   * secp_xfer_out
  //   * output_id: 00 00 00 07 
  //   * amount: 00 11 c3 79 37 d0 69 8f 
  //   * threshold: 00 00 00 00 00 00 00 00 
  //   * locktime: 00 00 00 01 
  //   * addresses[]
  //   * num_addresses: 00 00 00 01 
  //     * addresses[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 
  // * xfer_ins[]
  // * num_xfer_ins: 00 00 00 01 
  //   * xfer_ins[0]
  //   * tx_id: 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
  //   * utxo_index: 00 00 00 00 
  //   * asset_id: 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
  //   * secp_xfer_input
  //   * input_id: 00 00 00 05 
  //   * amount: 00 11 c3 79 37 e0 80 00 
  //   * address_indices[]
  //   * num_address_indices: 00 00 00 01 
  //     * address_indices[0]: 00 00 00 00 
  // * len_memo: 00 00 00 1a 
  // * memo: 00 18 31 37 67 52 6e 44 71 69 53 61 41 53 35 58 74 59 71 47 54 54 4d 67 4e 6b 
  // * destination_chain_id: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 
  // * export_xfer_outs[]
  // * num_export_xfer_outs: 00 00 00 01 
  //   * export_xfer_outs[0]
  //   * asset_id: 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
  //   * secp_xfer_output:
  //   * output_id: 00 00 00 07 
  //   * amount: 00 00 00 00 00 00 d4 31 
  //   * locktime: 00 00 00 00 00 00 00 00 
  //   * threshold: 00 00 00 01 
  //   * addresses[]
  //   * num_addresses: 00 00 00 01 
  //     * addresses[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 
  // * creds[]
  // * num_creds: 00 00 00 01 
  //   * creds[0]
  //   * cred_id: 00 00 00 09 
  //   * sigs[]
  //   * num_sigs: 00 00 00 01 
  //     * sigs[0]: 6d d3 c3 5b 4d 87 0d 70 32 97 ae ed 8f 7e 85 e0 e1 df 9a 09 83 26 e7 cb 62 a9 31 22 5f 41 f0 8d 25 d0 74 23 92 75 00 35 7b f0 68 07 cd 31 39 51 ee ec 47 e8 ff 63 b1 3d aa 49 48 19 5a 6a 67 ca 00

  // imports
  import { Avalanche, BinTools, BN } from "avalanche"
  import { Buffer } from 'buffer/'
  import { 
    AVMAPI, 
    AVMKeyChain, 
    Tx, 
    UnsignedTx,
    UTXOSet
  } from "avalanche/dist/apis/avm"
  import {
    PlatformVMAPI, 
    PlatformVMKeyChain,
  } from "avalanche/dist/apis/platformvm"
  import { 
    PlatformChainID,
  } from "avalanche/dist/utils/constants"

  // consts
  const ip: string = "localhost"
  const port: number = 9650
  const protocol: string = "http"
  const networkID: number = 12345
  const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
  const amount: BN = new BN(54321)
  const xchain: AVMAPI = avalanche.XChain()
  const bintools: BinTools = BinTools.getInstance()
  const xKeychain: AVMKeyChain = xchain.keyChain()
  const mypk: Buffer = bintools.cb58Decode("ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
  xKeychain.importKey(mypk)
  const xAddresses: Buffer[] = xchain.keyChain().getAddresses()
  const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
  const pchain: PlatformVMAPI = avalanche.PChain()
  const pKeychain: PlatformVMKeyChain = pchain.keyChain()
  pKeychain.importKey(mypk)
  const pAddressStrings: string[] = pchain.keyChain().getAddressStrings()
  console.log(xAddressStrings)
  console.log(pAddressStrings)
  
  // the goods
  const main = async (): Promise<any> => {
    // return false
    const utxoSet: UTXOSet = await xchain.getUTXOs(xAddresses)
    const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
    const memoCB58: string = bintools.cb58Encode(memoBuf)
    const memo: Buffer = bintools.stringToBuffer(memoCB58)
    const unsignedTx: UnsignedTx = await xchain.buildExportTx(
        utxoSet,
        amount,
        PlatformChainID,
        pAddressStrings,
        xAddressStrings,
        xAddressStrings,
        memo
    )
    const tx: Tx =  unsignedTx.sign(xKeychain)
    const txid: string = await xchain.issueTx(tx)
    console.log(`TXID: ${txid}`)
  }
  
  main()
