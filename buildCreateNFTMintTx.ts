// imports
import {
    Avalanche,
    BinTools,
    BN
  } from "avalanche" 
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
import {
  PayloadBase,
  BINPayload
} from "avalanche/dist/utils"
import { Buffer } from 'buffer/'
  
// boilerplate
const getUTXOID = (utxoids: string[], txid: string): string => {
    let utxoid : string = ""
    let result: string = ""
    for (let index: number = 0; index < utxoids.length; ++index) {
        utxoid = utxoids[index]
        if (utxoid.substring(0, 10) === txid.substring(0, 10)) {
            result = utxoid
            break
        }
    }
    return result
}
  
// consts
const ip: string = "testapi.avax.network"
const port: number = 443
const protocol: string = "https"
const networkID: number = 4
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const bintools: BinTools = BinTools.getInstance()
const myKeychain: AVMKeyChain = xchain.keyChain()
const mypk: Buffer = bintools.cb58Decode("ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
myKeychain.importKey(mypk)
const addresses: Buffer[] = xchain.keyChain().getAddresses()
const addressStrings: string[] = xchain.keyChain().getAddressStrings()
const amount: BN = new BN(54321)
const locktime: BN = new BN(0)
const threshold: number = 1
  
const secpOutput1 = new SecpOutput(amount, addresses, locktime, threshold)
const initialState = new InitialStates()
initialState.addOutput(secpOutput1, AVMConstants.SECPFXID)
const fee: BN = new BN(10)
xchain.setFee(fee)
  
// the goods
const main = async (): Promise<any> => {
const utxoSet: UTXOSet = await xchain.getUTXOs(addresses)
const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
const memoCB58: string = bintools.cb58Encode(memoBuf)
const groupID: number = 0
const binPayload: string = "01000001"
const payload: PayloadBase = new BINPayload(bintools.fromBNToBuffer(new BN(binPayload)))
let txid: string = "MFSqziggveXEd3ZzApnrU5k2wXRa7LgzNBRVqnhckPKBxnBdj"
const utxoids: string[] = utxoSet.getUTXOIDs()
const utxoid: string = getUTXOID(utxoids, txid)
const memo: Buffer = bintools.stringToBuffer(memoCB58)
const unsignedTx: UnsignedTx = await xchain.buildCreateNFTMintTx(
    utxoSet,
    addressStrings,
    addressStrings,
    utxoid,
    groupID, 
    payload.toBuffer(),
    memo
)
const tx: Tx =  unsignedTx.sign(myKeychain)
// console.log(tx.toBuffer().toString('hex'))
txid = await xchain.issueTx(tx)
console.log(txid)
}
  
main()

// * codec_id: 00 00 
// * type_id: 00 00 00 02 (Operation Tx)
// * network_id: 00 00 30 39 
// * blockchain_id: c5 60 ec 32 44 d5 bd 95 8f 7f c4 f7 de f0 7c 3c 3a d7 7d 9c 6e 65 8d 25 64 d7 6e a2 18 f3 26 58 
// * xfer_outs[]
// * num_xfer_outs: 00 00 00 01 
// * xfer_outs[0]
  // * asset_id: c0 ab e4 31 29 dc 69 5e b9 2c 4e 7d 2e c6 ef cb 38 9a 6f 37 4c 85 80 0b 14 22 58 78 e4 d7 6e 1f 
  // * output
  // * output_id: 00 00 00 07  (SECP256K1 Transfer Output)
  // * amount: 00 9f df 42 f6 e4 7f f6 
  // * locktime: 00 00 00 00 00 00 00 00 
  // * threshold: 00 00 00 01 
  // * addresses[] 
  // * num_addresses: 00 00 00 01 
    // * addresses[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 
// * xfer_ins[]
// * num_xfer_ins: 00 00 00 01 
// * xfer_ins[0]
  // * tx_id: 4a 0f 2f f3 79 9e 29 fa 0a 21 2a fb 62 a0 91 5d 73 2f 81 b7 88 4b a4 16 0f c8 f3 a7 ea 02 eb 44 
  // * utxo_index: 00 00 00 00 
  // * asset_id: c0 ab e4 31 29 dc 69 5e b9 2c 4e 7d 2e c6 ef cb 38 9a 6f 37 4c 85 80 0b 14 22 58 78 e4 d7 6e 1f 
  // * input_id: 00 00 00 05 (SECP256K1 Transfer Input)
  // * amount: 00 9f df 42 f6 e4 7f f6  (44999999999999990)
  // * address_indices[]
  // * num_address_indices: 00 00 00 01 
    // * address_indices[0]: 00 00 00 00 
// * len_memo: 00 00 00 1a 
// * memo: 00 18 31 37 67 52 6e 44 71 69 53 61 41 53 35 58 74 59 71 47 54 54 4d 67 4e 6b  ("Avalanche.js")
// * xfer_ops[]
// * num_xfer_ops: 00 00 00 01 
// * xfer_ops[0]:
  // * asset_id: c0 ab e4 31 29 dc 69 5e b9 2c 4e 7d 2e c6 ef cb 38 9a 6f 37 4c 85 80 0b 14 22 58 78 e4 d7 6e 1f 
  // * utxo_ids[]:
  // * num_utxo_ids: 00 00 00 01 
    // * utxo_ids[0]: 4a 0f 2f f3 79 9e 29 fa 0a 21 2a fb 62 a0 91 5d 73 2f 81 b7 88 4b a4 16 0f c8 f3 a7 ea 02 eb 44 00 00 00 00 
  // * operation_id: 00 00 00 0c (NFT Mint Operation)
  // * address_indices[]
  // * num_address_indices: 00 00 00 01 
    // * address_indices[0]: 00 00 00 00 
  // * group_id: 00 00 00 00 
  // * len_payload: 00 00 00 08 
  // * payload: 00 00 00 04 00 0f 42 41 
  // * outputs[]: 
  // * num_outputs[]: 00 00 00 01 
  // * locktime: 00 00 00 00 00 00 00 00 
  // * threshold: 00 00 00 01 
  // * addresses[]
  // * num_addresses: 00 00 00 01 
    // * addresses[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 
// * creds[]
// * num_creds: 00 00 00 02
//   * credential_type: 00 00 00 09 (SECP256K1 Credential)
//   * sigs[]
//   * num_sigs: 00 00 00 01
//     * sig[0]: e1 36 7e 06 99 8e 81 94 10 e0 0c af 7b 4e c4 62 29 be c1 b4 38 81 25 8d 94 de 25 36 83 d6 c0 81 34 e3 c3 b2 30 3a 4d 33 50 af c6 ba 8e 19 fc a0 b3 b1 ee 8e 2b 33 1e 94 5f b2 74 b4 ae a8 fc 61 00
//   * credential_type: 00 00 00 0e (NFT Credential)
//   * sigs[]
//   * num_sigs: 00 00 00 01
//     * sig[0]: e1 36 7e 06 99 8e 81 94 10 e0 0c af 7b 4e c4 62 29 be c1 b4 38 81 25 8d 94 de 25 36 83 d6 c0 81 34 e3 c3 b2 30 3a 4d 33 50 af c6 ba 8e 19 fc a0 b3 b1 ee 8e 2b 33 1e 94 5f b2 74 b4 ae a8 fc 61 00