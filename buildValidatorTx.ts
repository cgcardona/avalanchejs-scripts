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
import { UnixNow } from "avalanche/dist/utils"

// consts
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const pchain: PlatformVMAPI = avalanche.PChain()
const bintools: BinTools = BinTools.getInstance()
const pKeychain: PlatformVMKeyChain = pchain.keyChain()
const mypk: Buffer = bintools.cb58Decode("ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
pKeychain.importKey(mypk)
const pAddresses: Buffer[] = pchain.keyChain().getAddresses()
const pAddressStrings: string[] = pchain.keyChain().getAddressStrings()
console.log(pAddressStrings)
const nodeID: string = "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg"
const startTime: BN = UnixNow().add(new BN(60 * 5));
const endTime: BN = startTime.add(new BN(1209600));
const stakeAmount: BN = new BN(2000000000000)
const delegationFee: number = 10

// the goods
const main = async (): Promise<any> => {
  const utxoSet: UTXOSet = await pchain.getUTXOs(pAddressStrings)
  // return false
  const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
  const memoCB58: string = bintools.cb58Encode(memoBuf)
  const memo: Buffer = bintools.stringToBuffer(memoCB58)
  const unsignedTx: UnsignedTx = await pchain.buildAddValidatorTx(
    utxoSet,
    pAddressStrings,
    pAddressStrings,
    nodeID,
    startTime,
    endTime,
    stakeAmount,
    pAddressStrings[0],
    delegationFee,
    memo
  )
  const tx: Tx =  unsignedTx.sign(pKeychain)
  console.log(tx.toBuffer().toString('hex'))
  const txid: string = await pchain.issueTx(tx)
  console.log(`TXID: ${txid}`)
}

main()

// * codec_id: 00 00 
// * type_id: 00 00 00 0c 
// * network_id: 00 00 30 39 
// * blockchain_id: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 

// * xfer_outs[]
// * num_xfer_outs: 00 00 00 01 
// * xfer_outs[0]
// * asset_id: 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
// * secp_xfer_output
// * output_id: 00 00 00 07 
// * amount: 00 11 c1 a7 8e 87 1d c0 
// * locktime: 00 00 00 00 00 00 00 00 
// * threshold: 00 00 00 01 
// * addresses[]
// * num_addresses: 00 00 00 01 
// * addresses[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 

// * xfer_ins[]
// * num_xfer_ins: 00 00 00 01 
// * xfer_ins[0]
// * tx_id: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 
// * utxo_index: 00 00 00 00 
// * asset_id: 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
// * secp_xfer_input
// * input_id: 00 00 00 05 
// * amount: 00 11 c3 79 37 e0 80 00 
// * address_indices[]
// * num_address_indices: 00 00 00 01 
// * address_indices[0]: 00 00 00 00 

// * len_memo: 00 00 00 1a 
// * memo: 00 18 31 37 67 52 6e 44 71 69 53 61 41 53 35 58 74 59 71 47 54 54 4d 67 4e 6b 

// * node_id: 47 9f 66 c8 be 89 58 30 54 7e 70 b4 b2 98 ca fd 43 3d ba 6e 

// * start_time: 00 00 00 00 5f 49 31 02 (1598632194)
// * end_time: 00 00 00 00 5f 5b a6 02 (1599841794)
// * stake_amount: 00 00 01 d1 a9 4a 20 00 (2000000000000)
// * why is this stake amount twice?: 00 00 01 d1 a9 4a 20 00 

// * num_what: 00 00 00 01 

// * tx_id: 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
// * secp_xfer_output
// * output_id: 00 00 00 07 
// * amount: 00 00 01 d1 a9 4a 20 00 (2000000000000)
// * locktime: 00 00 00 00 00 00 00 00 
// * threshold: 00 00 00 01 
// * addresses[]
// * num_addresses: 00 00 00 01 
// * addresses[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 

// * what is this duplicate?: 3c b7 d3 84 2e 8c ee 6a 
// * delegation_fee: 00 01 86 a0 

// * creds[]
// * num_creds: 00 00 00 01 
// * creds[0]
// * type_id: 00 00 00 09 
// * sigs[]
// * num_sigs: 00 00 00 01 
// * sigs[0]: 9c 1a 31 d6 26 ce 73 97 a9 9e 99 1c 68 b5 cd 9d aa 04 2f e7 2e 88 f4 46 f1 b5 5a ae 98 6f 30 9c 1c b5 3b e8 41 95 4b 6d 6b 2d 4e 1f 0d 61 3f 62 55 5a 59 f9 13 11 ea 48 65 30 f7 81 b3 85 9f dd 01

