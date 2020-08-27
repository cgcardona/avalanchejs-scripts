  // imports
  import { Avalanche, BinTools, BN } from "avalanche"
  import { Buffer } from 'buffer/'
  import { 
    AVMAPI, 
    AVMConstants, 
    AVMKeyChain, 
    InitialStates, 
    SecpOutput, 
    Tx, 
    UnsignedTx,
    UTXOSet
  } from "avalanche/dist/apis/avm"

  // consts
  const ip: string = "localhost"
  const port: number = 9650
  const protocol: string = "http"
  const networkID: number = 12345
  const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
  const xchain: AVMAPI = avalanche.XChain()
  const bintools: BinTools = BinTools.getInstance()
  const myKeychain: AVMKeyChain = xchain.keyChain()
  const mypk: Buffer = bintools.cb58Decode("ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
  myKeychain.importKey(mypk)
  const addresses: Buffer[] = xchain.keyChain().getAddresses()
  const addressStrings: string[] = xchain.keyChain().getAddressStrings()
  const fee: BN = new BN(10)
  xchain.setFee(fee)
  const amount: BN = new BN(54321)
  const name: string = "Test Token"
  const symbol: string = "TEST"
  const denomination: number = 9
  const locktime: BN = new BN(0)
  const threshold: number = 1
  const secpOutput1 = new SecpOutput(amount, addresses, locktime, threshold)
  const initialState = new InitialStates()
  initialState.addOutput(secpOutput1, AVMConstants.SECPFXID)
  
  // the goods
  const main = async (): Promise<any> => {
    const utxoSet: UTXOSet = await xchain.getUTXOs(addresses)
    const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
    const memoCB58: string = bintools.cb58Encode(memoBuf)
    const memo: Buffer = bintools.stringToBuffer(memoCB58)
    const unsignedTx: UnsignedTx = await xchain.buildCreateAssetTx(
        utxoSet,
        addressStrings,
        initialState,
        name,
        symbol,
        denomination,
        memo
    )
    const tx: Tx =  unsignedTx.sign(myKeychain)
    const txid: string = await xchain.issueTx(tx)
    console.log(`TXID: ${txid}`)
  }
  
  main()

//   * codec_id: 00 00
//   * type_id: 00 00 00 01
//   * network_id: 00 00 30 39
//   * blockchain_id: c5 60 ec 32 44 d5 bd 95 8f 7f c4 f7 de f0 7c 3c 3a d7 7d 9c 6e 65 8d 25 64 d7 6e a2 18 f3 26 58
//   * xfer_outs[]
//   * num_xfer_outs: 00 00 00 02
//     * xfer_outs[0]
//     * asset_id: c0 ab e4 31 29 dc 69 5e b9 2c 4e 7d 2e c6 ef cb 38 9a 6f 37 4c 85 80 0b 14 22 58 78 e4 d7 6e 1f
//     * output_id: 00 00 00 07
//     * amount: 00 9f df 42 f6 e4 7f f6  (44999999999999990)
//     * locktime: 00 00 00 00 00 00 00 00
//     * threshold: 00 00 00 01
//     * addresses[]
//     * num_addresses: 00 00 00 01
//       * addresses[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c
//   * xfer_ins[]
//   * num_xfer_ins: 00 00 00 01
//     * xfer_ins[0]:  
//     * tx_id: c0 ab e4 31 29 dc 69 5e b9 2c 4e 7d 2e c6 ef cb 38 9a 6f 37 4c 85 80 0b 14 22 58 78 e4 d7 6e 1f
//     * utxo_index: 00 00 00 00
//     * asset_id: c0 ab e4 31 29 dc 69 5e b9 2c 4e 7d 2e c6 ef cb 38 9a 6f 37 4c 85 80 0b 14 22 58 78 e4 d7 6e 1f
//     * input_id: 00 00 00 05
//     * amount: 00 9f df 42 f6 e4 80 00 (45000000000000000)
//     * address_indices[]
//     * num_address_indices: 00 00 00 01
//       * address_indices[0]: 00 00 00 00
//   * memo_len: 00 00 00 1a
//   * memo: 00 18 31 37 67 52 6e 44 71 69 53 61 41 53 35 58 74 59 71 47 54 54 4d 67 4e 6b
//   * name_len: 00 0a
//   * name: 54 65 73 74 20 54 6f 6b 65 6e
//   * symbol_len: 00 04
//   * symbol: 54 45 53 54
//   * denomination: 09
//   * initial_state[]
//   * num_initial_state: 00 00 00 01
//     * initial_state[0]
//     * fx_id: 00 00 00 00
//     * outputs[]
//     * num_outputs: 00 00 00 01
//       * output_id: 00 00 00 07
//       * amount: 00 00 00 00 00 00 d4 31 (54321)
//       * locktime: 00 00 00 00 00 00 00 00
//       * threshold: 00 00 00 01
//       * addresses[]
//       * num_addresses: 00 00 00 01
//         * addresses[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c
// * creds[]
// * num_creds: 00 00 00 01
// * credential_type: 00 00 00 09
// * length: 00 00 00 01
// * sig[0]: f0 f3 72 50 c7 c7 3b 6e 45 16 75 a4 35 bc 8e 1f f0 6e 4f 5f de 6d c7 4e f4 dc 70 16 7a 74 83 48 74 f8 01 47 7e cf 89 a9 e0 ce 5d 3d 9e f0 f4 33 5e ca e3 55 fa 16 6f 0d d5 9e d0 ea 31 eb ee a0 01