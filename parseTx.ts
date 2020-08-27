  // imports
  import { 
    avm, 
    Avalanche, 
    BinTools, 
    BN 
  } from "avalanche"
  import { Buffer } from 'buffer/'
  
  // consts
  const ip: string = "localhost"
  const port: number = 9650
  const protocol: string = "http"
  const networkID: number = 12345
  const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
  const xchain: avm.AVMAPI = avalanche.XChain()
  const bintools: BinTools = BinTools.getInstance()
  const myKeychain: avm.AVMKeyChain = xchain.keyChain()
  const mypk: Buffer = bintools.cb58Decode("ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
  myKeychain.importKey(mypk)
  const addresses: Buffer[] = xchain.keyChain().getAddresses()
  const addressStrings: string[] = xchain.keyChain().getAddressStrings()
  const amount: BN = new BN(54321)
  const fee: BN = new BN(10)
  xchain.setFee(fee)
  
  // the goods
  const main = async (): Promise<any> => {
    const utxoSet: avm.UTXOSet = await xchain.getUTXOs(addresses)
    const assetID: Buffer = await xchain.getAVAXAssetID()
    const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
    const memoCB58: string = bintools.cb58Encode(memoBuf)
    const memo: Buffer = bintools.stringToBuffer(memoCB58)
    const unsignedTx: avm.UnsignedTx = await xchain.buildBaseTx(
        utxoSet,
        amount,
        assetID,
        addressStrings,
        addressStrings,
        addressStrings,
        memo,
    )
    const tx: avm.Tx =  unsignedTx.sign(myKeychain)
    const txid: string = await xchain.issueTx(tx)
    console.log(`TXID: ${txid}`)
  }
  
  main()

// * codec_id: 00 00
// * type_id: 00 00 00 00
// * network_id: 00 00 30 39
// * blockchain_id: c5 60 ec 32 44 d5 bd 95 8f 7f c4 f7 de f0 7c 3c 3a d7 7d 9c 6e 65 8d 25 64 d7 6e a2 18 f3 26 58
// * xfer_outs[]
// * num_xfer_outs: 00 00 00 02
// * xfer_outs[0]
// * asset_id: c0 ab e4 31 29 dc 69 5e b9 2c 4e 7d 2e c6 ef cb 38 9a 6f 37 4c 85 80 0b 14 22 58 78 e4 d7 6e 1f
// * output_id: 00 00 00 07
// * amount: 00 00 00 00 00 00 d4 31
// * locktime: 00 00 00 00 00 00 00 00
// * threshold: 00 00 00 01
// * addresses[]
// * num_addresses: 00 00 00 01
// * addresses[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c
// * xfer_outs[1]
// * asset_id: c0 ab e4 31 29 dc 69 5e b9 2c 4e 7d 2e c6 ef cb 38 9a 6f 37 4c 85 80 0b 14 22 58 78 e4 d7 6e 1f
// * output_id: 00 00 00 07
// * amount: 00 9f df 42 f6 e3 ab c5
// * locktime: 00 00 00 00 00 00 00 00
// * threshold: 00 00 00 01
// * addresses[]
// * num_addresses: 00 00 00 01
// * addresses[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c
// * xfer_ins[]
// * num_xfer_ins: 00 00 00 01
// * xfer_ins[0]:  
// * tx_id: c0 ab e4 31 29 dc 69 5e b9 2c 4e 7d 2e c6 ef cb 38 9a 6f 37 4c 85 80 0b 14 22 58 78 e4 d7 6e 1f
// * utxo_index: 00 00 00 00
// * asset_id: c0 ab e4 31 29 dc 69 5e b9 2c 4e 7d 2e c6 ef cb 38 9a 6f 37 4c 85 80 0b 14 22 58 78 e4 d7 6e 1f
// * input_id: 00 00 00 05
// * amount: 00 9f df 42 f6 e4 80 00
// * address_indices[]
// * num_address_indices: 00 00 00 01
// * address_indices[0]: 00 00 00 00
// * memo_len: 00 00 00 1a
// * memo: 00 18 31 37 67 52 6e 44 71 69 53 61 41 53 35 58 74 59 71 47 54 54 4d 67 4e 6b
// * creds[]
// * num_creds: 00 00 00 01
// * credential_type: 00 00 00 09
// * length: 00 00 00 01
// * sig[0]: 63 f2 78 27 57 a8 17 f5 5e e3 22 d1 f3 bb 88 46 36 9e a5 6c 16 40 4c d5 69 6d e1 99 cd 34 44 12 69 f5 58 6d 5c f3 03 93 13 96 f2 db 34 c6 68 31 f7 5b 8e f2 8e 57 74 0c ab 21 1b 32 cb b2 eb 93 01

// ### UTXOs

// UTXO 1

// * codec_id: 00 00
// * tx_id: e0 b6 a4 15 b4 5a 57 33 c5 0a 21 b1 d9 5b 8f 17 79 a0 b5 4c c3 c8 9f 4b 78 8a 8d 3a 08 88 13 55
// * output_index: 00 00 00 00
// * asset_id: c0 ab e4 31 29 dc 69 5e b9 2c 4e 7d 2e c6 ef cb 38 9a 6f 37 4c 85 80 0b 14 22 58 78 e4 d7 6e 1f
// * output_id: 00 00 00 07
// * amount: 00 00 00 00 00 00 d4 31 (54321)
// * locktime: 00 00 00 00 00 00 00 00
// * threshold: 00 00 00 01
// * addresses[]
// * num_addresses: 00 00 00 01
// * addresses[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c

// UTXO 2

// * codec_id: 00 00
// * tx_id: e0 b6 a4 15 b4 5a 57 33 c5 0a 21 b1 d9 5b 8f 17 79 a0 b5 4c c3 c8 9f 4b 78 8a 8d 3a 08 88 13 55
// * output_index: 00 00 00 01
// * asset_id: c0 ab e4 31 29 dc 69 5e b9 2c 4e 7d 2e c6 ef cb 38 9a 6f 37 4c 85 80 0b 14 22 58 78 e4 d7 6e 1f
// * output_id: 00 00 00 07
// * amount: 00 9f df 42 f6 e3 ab c5 (44999999999945669)
// * locktime: 00 00 00 00 00 00 00 00
// * threshold: 00 00 00 01
// * addresses[]
// * num_addresses: 00 00 00 01
// * addresses[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c

// 44999999999945669 (change) + 54321 (amount sent) + 10 (fee) = 45000000000000000
