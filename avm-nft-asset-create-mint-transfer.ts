// Create Asset Tx
// More info: https://docs.avax.network/v1.0/en/references/avm-transaction-serialization/#what-unsigned-create-asset-tx-contains
// Operation Tx
// More info: https://docs.avax.network/v1.0/en/references/avm-transaction-serialization/#what-unsigned-operation-tx-contains
const sleep = (ms: number): Promise<unknown> => {
  return new Promise( resolve => setTimeout(resolve, ms) )
}

const getUTXOIDs = (utxoSet: UTXOSet, txid: string, outputType: number = AVMConstants.SECPOUTPUTID): string[] => {
  const utxoids: string[] = utxoSet.getUTXOIDs()
  let result: string[] = []
  for (let index: number = 0; index < utxoids.length; ++index) {
    if (utxoids[index].indexOf(txid.slice(0,10)) != -1 && utxoSet.getUTXO(utxoids[index]).getOutput().getOutputID() == outputType) {
      result.push(utxoids[index])
    }
  }
  return result
}

import { Avalanche, BinTools, BN } from "avalanche"
import { Buffer } from 'buffer/'
import { 
  AmountOutput,
  AVMAPI, 
  AVMConstants,
  AVMKeyChain, 
  CreateAssetTx,
  InitialStates,
  NFTMintOutput,
  MinterSet,
  NFTMintOperation,
  NFTTransferOperation,
  NFTTransferOutput,
  OperationTx,
  SecpInput,
  SecpOutput,
  TransferableInput,
  TransferableOperation,
  TransferableOutput,
  Tx, 
  UnsignedTx,
  UTXO,
  UTXOSet,
} from "avalanche/dist/apis/avm"
import { OutputOwners } from "avalanche/dist/common"

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
xKeychain.importKey("PrivateKey-")
const xAddresses: Buffer[] = avm.keyChain().getAddresses()
const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
console.log(xAddressStrings)
const locktime: BN = new BN(0)
const threshold: number = 1
let ins: TransferableInput[] = []
let outs: TransferableOutput[] = []
let ops: TransferableOperation[] = []
const mstimeout: number = 5000

const main = async (): Promise<any> => {
  // step 1 create NFT family
  const assetID: Buffer = await avm.getAVAXAssetID()
  let result: any = await avm.getBalance(xAddressStrings[0], bintools.cb58Encode(assetID))
  let balance: BN = new BN(result.balance)
  let fee: BN = avm.getFee()
  let avaxAmount: BN = balance.sub(fee)
  let secpOutput: SecpOutput = new SecpOutput(avaxAmount, xAddresses, locktime, threshold)
  let transferableOutput: TransferableOutput =  new TransferableOutput(assetID, secpOutput)
  outs.push(transferableOutput)

  let utxoSet: UTXOSet = await avm.getUTXOs([xAddressStrings[0]])
  let utxo: UTXO = utxoSet.getAllUTXOs()[0]
  let output: AmountOutput = utxo.getOutput() as AmountOutput
  let amt: BN = output.getAmount().clone()
  let txid: Buffer = utxo.getTxID()
  let outputidx: Buffer = utxo.getOutputIdx()

  let secpInput: SecpInput = new SecpInput(amt)
  secpInput.addSignatureIdx(0, xAddresses[0])

  let transferableInput: TransferableInput = new TransferableInput(txid, outputidx, assetID, secpInput)
  ins.push(transferableInput)

  const name: string = "non fungible token" 
  const symbol: string = "NFT" 
  const initialStates: InitialStates = new InitialStates()
  const groupID: number = 0
  const minterSets: MinterSet[] = [new MinterSet(threshold, xAddresses)]
  const nftMintOutput: NFTMintOutput = new NFTMintOutput(
    groupID,
    minterSets[0].getMinters(),
    locktime, 
    minterSets[0].getThreshold()
  )
  initialStates.addOutput(nftMintOutput, AVMConstants.NFTFXID)
  const denomination: number = 0 // NFTs are non-fungible
  const createAssetTx: CreateAssetTx = new CreateAssetTx(networkID, blockchainID, outs, ins, memo, name, symbol, denomination, initialStates)
  let unsignedTx: UnsignedTx = new UnsignedTx(createAssetTx)
  let tx: Tx = unsignedTx.sign(xKeychain)
  let id: string = await avm.issueTx(tx)
  console.log(id)
  await sleep(mstimeout)

  // step 2 mint NFT
  ins = []
  outs = []
  result = await avm.getBalance(xAddressStrings[0], bintools.cb58Encode(assetID))
  balance = new BN(result.balance)
  avaxAmount = balance.sub(fee)
  secpOutput = new SecpOutput(avaxAmount, xAddresses, locktime, threshold)
  transferableOutput =  new TransferableOutput(assetID, secpOutput)
  outs.push(transferableOutput)

  const payload: Buffer = memo
  const nftMintOperation: NFTMintOperation = new NFTMintOperation(groupID, payload, [new OutputOwners(xAddresses, locktime, threshold)])
  utxoSet = await avm.getUTXOs(xAddressStrings)
  let secpUTXOIDs: string[] = getUTXOIDs(utxoSet, id, AVMConstants.SECPOUTPUTID)
  let secpUtxo: UTXO = utxoSet.getUTXO(secpUTXOIDs[0])

  output = secpUtxo.getOutput() as AmountOutput
  amt = output.getAmount().clone()
  txid = secpUtxo.getTxID()
  outputidx = secpUtxo.getOutputIdx()

  secpInput = new SecpInput(amt)
  secpInput.addSignatureIdx(0, xAddresses[0])

  transferableInput = new TransferableInput(txid, outputidx, assetID, secpInput)
  ins.push(transferableInput)

  let utxoids: string[] = getUTXOIDs(utxoSet, id, AVMConstants.NFTMINTOUTPUTID)

  utxo = utxoSet.getUTXO(utxoids[0])
  let out: NFTTransferOutput = utxo.getOutput() as NFTTransferOutput
  let spenders: Buffer[] = out.getSpenders(xAddresses)

  spenders.forEach((spender: Buffer) => {
    const idx: number = out.getAddressIdx(spender)
    nftMintOperation.addSignatureIdx(idx, spender)
  })
    
  let transferableOperation: TransferableOperation = new TransferableOperation(utxo.getAssetID(), utxoids, nftMintOperation)
  ops.push(transferableOperation)

  let operationTx: OperationTx = new OperationTx(networkID, blockchainID, outs, ins, memo, ops)
  unsignedTx = new UnsignedTx(operationTx)
  tx = unsignedTx.sign(xKeychain)
  id = await avm.issueTx(tx)
  console.log(id)
  await sleep(mstimeout)

  // step 3 transfer NFT
  ins = []
  outs = []
  ops = []
  result = await avm.getBalance(xAddressStrings[0], bintools.cb58Encode(assetID))
  balance = new BN(result.balance)
  avaxAmount = balance.sub(fee)
  secpOutput = new SecpOutput(avaxAmount, xAddresses, locktime, threshold)
  transferableOutput =  new TransferableOutput(assetID, secpOutput)
  outs.push(transferableOutput)
  utxoSet = await avm.getUTXOs(xAddressStrings)
  secpUTXOIDs = getUTXOIDs(utxoSet, id, AVMConstants.SECPOUTPUTID)
  secpUtxo = utxoSet.getUTXO(secpUTXOIDs[0])

  output = secpUtxo.getOutput() as AmountOutput
  amt = output.getAmount().clone()
  txid = secpUtxo.getTxID()
  outputidx = secpUtxo.getOutputIdx()

  secpInput = new SecpInput(amt)
  secpInput.addSignatureIdx(0, xAddresses[0])

  transferableInput = new TransferableInput(txid, outputidx, assetID, secpInput)
  ins.push(transferableInput)

  utxoids = getUTXOIDs(utxoSet, id, AVMConstants.NFTXFEROUTPUTID)

  utxo = utxoSet.getUTXO(utxoids[0])
  out = utxo.getOutput() as NFTTransferOutput
  spenders = out.getSpenders(xAddresses)

  const xaddy: Buffer = bintools.stringToAddress("X-local1dl4asvefzhn2559gkehr6m4c6tx5hn0stznerp")

  const outbound:NFTTransferOutput = new NFTTransferOutput(
    out.getGroupID(), out.getPayload(), [xaddy], locktime, threshold, 
  )
  const op: NFTTransferOperation = new NFTTransferOperation(outbound)

  spenders.forEach((spender: Buffer) => {
    const idx: number = out.getAddressIdx(spender)
    op.addSignatureIdx(idx, spender)
  })
    
  const xferop: TransferableOperation = new TransferableOperation(utxo.getAssetID(), [utxoids[0]], op)
  ops.push(xferop)

  operationTx = new OperationTx(networkID, blockchainID, outs, ins, memo, ops)
  unsignedTx = new UnsignedTx(operationTx)
  tx = unsignedTx.sign(xKeychain)
  id = await avm.issueTx(tx)
  console.log(id)
}
  
main()
