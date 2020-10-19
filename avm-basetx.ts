// AVM BaseTx
// https://docs.avax.network/v1.0/en/references/avm-transaction-serialization/#what-base-tx-contains
// * codec_id: 00 00 
// * type_id (base_tx): 00 00 00 00 
// * network_id: 00 00 30 39 
// * blockchain_id: 78 7c d3 24 3c 00 2e 9b f5 bb ba ea 8a 42 a1 6c 1a 19 cc 10 50 47 c6 69 96 80 7c bf 16 ac ee 10 

// * num_xfer_outs: 00 00 00 01 
// * xfer_outs[0]
// * asset_id: 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
// * type_id (secp_xfer_out): 00 00 00 07 
// * amount: 00 03 86 37 ff 60 f7 00 
// * locktime: 00 00 00 00 00 00 00 00 
// * threshold: 00 00 00 01 
// * num_addrs: 00 00 00 01 
// * addrs[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 

// * num_xfer_ins: 00 00 00 01 
// * tx_id: 89 c3 cc 5f cb 37 ae f6 d1 81 99 07 66 10 b1 9b 31 5e 31 d1 30 c7 7c f6 4c f5 b6 64 7c 7a 38 4d 
// * utxo_index: 00 00 00 00 
// * asset_id: 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
// * type_id (secp_xfer_in): 00 00 00 05 
// * amount: 00 11 bc 32 92 7a f7 00 
// * num_addr_indices: 00 00 00 01 
// * addr_indices[0]: 00 00 00 00

// * len_memo: 00 00 00 0e 
// * memo: 00 0c 41 76 61 6c 61 6e 63 68 65 2e 6a 73 

// * num_creds: 00 00 00 01 
// * creds[0]:
// * type_id (secp_cred): 00 00 00 09 
// * num_sigs: 00 00 00 01 
// * sigs[0]: ae 45 8b 8e 4d a0 1a f9 cc 71 db 8b 22 6a 6f 4f c2 7f bc 09 6d f5 d0 ad 23 70 79 06 f1 d8 ac 3b 67 c6 ee ec 7a 58 a8 c9 ca 08 1c 00 2f bd 84 c5 ca 2c 5a e5 2f ac b1 44 90 2f 5e 7a 18 56 eb 99 00

import { Avalanche, BinTools, BN, platformvm } from "avalanche"
import { Buffer } from 'buffer/'
import { 
  AmountOutput,
  AVMAPI, 
  AVMKeyChain, 
  BaseTx,
  SECPTransferInput,
  SECPTransferOutput,
  TransferableInput,
  TransferableOutput,
  Tx, 
  UnsignedTx,
  UTXO,
  UTXOSet,
} from "avalanche/dist/apis/avm"

const ip: string = "localhost"
const protocol: string = "http"
const networkID: number = 12345
const port: number = 9650
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const bintools: BinTools = BinTools.getInstance()
const avm: AVMAPI = avalanche.XChain()
const blockchainID: Buffer = bintools.cb58Decode(avm.getBlockchainID())
const xKeychain: AVMKeyChain = avm.keyChain()
const memo: Buffer = bintools.stringToBuffer("Avalanche.js")
xKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
const xAddresses: Buffer[] = avm.keyChain().getAddresses()
const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
const amount: BN = new BN(991999996000000)
const locktime: BN = new BN(0)
const threshold: number = 1
const ins: TransferableInput[] = []
const outs: TransferableOutput[] = []

const main = async (): Promise<any> => {
  console.log(platformvm.PlatformVMConstants.MINSTAKE.toString())
  return false
  const assetID: Buffer = await avm.getAVAXAssetID()
  const secpOutput: SECPTransferOutput = new SECPTransferOutput(amount, xAddresses, locktime, threshold)
  const transferableOutput: TransferableOutput =  new TransferableOutput(assetID, secpOutput)
  outs.push(transferableOutput)

  const utxoSet: UTXOSet = await avm.getUTXOs([xAddressStrings[0]])
  const utxo: UTXO = utxoSet.getAllUTXOs()[0]
  const output: AmountOutput = utxo.getOutput() as AmountOutput
  const amt: BN = output.getAmount().clone()
  const txid: Buffer = utxo.getTxID()
  const outputidx: Buffer = utxo.getOutputIdx()

  const secpInput: SECPTransferInput = new SECPTransferInput(amt)
  secpInput.addSignatureIdx(0, xAddresses[0])

  const transferableInput: TransferableInput = new TransferableInput(txid, outputidx, assetID, secpInput)
  ins.push(transferableInput)

  const baseTx:BaseTx = new BaseTx(networkID, blockchainID, outs, ins, memo)
  const unsignedTx: UnsignedTx = new UnsignedTx(baseTx)
  const tx: Tx = unsignedTx.sign(xKeychain)
  const id: string = await avm.issueTx(tx)
  console.log(id)
}
  
main()

