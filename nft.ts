const sleep = (ms: number): Promise<unknown> => {
  return new Promise( resolve => setTimeout(resolve, ms) )
}

const getUTXOIDs = (utxoSet: UTXOSet, txid: string, outputType: number = AVMConstants.SECPXFEROUTPUTID): string[] => {
  const utxoids: string[] = utxoSet.getUTXOIDs()
  let result: string[] = []
  utxoids.forEach((utxoid: string) => {
    if (utxoid.indexOf(txid.slice(0,10)) != -1 && utxoSet.getUTXO(utxoid).getOutput().getOutputID() == outputType) {
      result.push(utxoid)
    }
  })
  return result
}

import { Avalanche, BinTools, BN, Buffer } from "avalanche"
import { 
  AmountOutput,
  AVMAPI, 
  AVMConstants,
  KeyChain, 
  CreateAssetTx,
  InitialStates,
  NFTMintOutput,
  MinterSet,
  NFTMintOperation,
  NFTTransferOperation,
  NFTTransferOutput,
  OperationTx,
  SECPTransferInput,
  SECPTransferOutput,
  TransferableInput,
  TransferableOperation,
  TransferableOutput,
  Tx, 
  UnsignedTx,
  UTXO,
  UTXOSet,
} from "avalanche/dist/apis/avm"
import { OutputOwners } from "avalanche/dist/common"
import { UnixNow } from "avalanche/dist/utils"

const ip: string = "localhost"
const protocol: string = "http"
const networkID: number = 12345
const port: number = 9650
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const bintools: BinTools = BinTools.getInstance()
const avm: AVMAPI = avalanche.XChain()
const blockchainID: Buffer = bintools.cb58Decode(avm.getBlockchainID())
const xKeychain: KeyChain = avm.keyChain()
const memo: Buffer = bintools.stringToBuffer("NFT Creation")
xKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
const xAddresses: Buffer[] = avm.keyChain().getAddresses()
const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
// console.log(xAddressStrings)
const locktime: BN = new BN(0)
const threshold: number = 1
let ins: TransferableInput[] = []
let outs: TransferableOutput[] = []
const ops: TransferableOperation[] = []
const mstimeout: number = 5000

const main = async (): Promise<any> => {
  // step 1 create NFT family
  const assetID: Buffer = await avm.getAVAXAssetID()
  let result: any = await avm.getBalance(xAddressStrings[0], bintools.cb58Encode(assetID))
  let balance: BN = new BN(result.balance)
  const fee: BN = avm.getTxFee()
  let avaxAmount: BN = balance.sub(fee)
  let secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(avaxAmount, xAddresses, locktime, threshold)
  let transferableOutput: TransferableOutput =  new TransferableOutput(assetID, secpTransferOutput)
  outs.push(transferableOutput)

  let u = await avm.getUTXOs([xAddressStrings[0]])
  let utxoSet: UTXOSet = u.utxos
  let utxo: UTXO = utxoSet.getAllUTXOs()[0]
  let output: AmountOutput = utxo.getOutput() as AmountOutput
  let amt: BN = output.getAmount().clone()
  let txid: Buffer = utxo.getTxID()
  let outputidx: Buffer = utxo.getOutputIdx()

  let secpInput: SECPTransferInput = new SECPTransferInput(amt)
  secpInput.addSignatureIdx(0, xAddresses[0])

  let transferableInput: TransferableInput = new TransferableInput(txid, outputidx, assetID, secpInput)
  ins.push(transferableInput)

  const name: string = "non fungible token" 
  const symbol: string = "NFT" 
  const initialStates: InitialStates = new InitialStates()
  for(let i: number = 0; i < 2; i++) {
    const groupID: number = 0 
    const minterSet: MinterSet = new MinterSet(threshold, xAddresses)
    const nftMintOutput: NFTMintOutput = new NFTMintOutput(
      groupID,
      minterSet.getMinters(),
      locktime, 
      minterSet.getThreshold()
    )
    initialStates.addOutput(nftMintOutput, AVMConstants.NFTFXID)
  }
  const denomination: number = 0 // NFTs are non-fungible
  const createAssetTx: CreateAssetTx = new CreateAssetTx(networkID, blockchainID, outs, ins, memo, name, symbol, denomination, initialStates)
  let unsignedTx: UnsignedTx = new UnsignedTx(createAssetTx)
  let tx: Tx = unsignedTx.sign(xKeychain)
  console.log(tx.toBuffer().toString('hex'))
//   let id: string = await avm.issueTx(tx)
  let id: string = '2nBBLoRpoYPpazM6uKqy3z3uStD1KGCKKkdy5h5QMnQTAPLAiS'
  console.log(id)
//   await sleep(mstimeout)
  // end working

  // step 2 mint NFT
  ins = []
  outs = []
  result = await avm.getBalance(xAddressStrings[0], bintools.cb58Encode(assetID))
  balance = new BN(result.balance)
  avaxAmount = balance.sub(fee)
  secpTransferOutput = new SECPTransferOutput(avaxAmount, xAddresses, locktime, threshold)
  transferableOutput =  new TransferableOutput(assetID, secpTransferOutput)
  outs.push(transferableOutput)

  let secpUTXOIDs: string[] = getUTXOIDs(utxoSet, id, AVMConstants.SECPXFEROUTPUTID)
  let secpUtxo: UTXO = utxoSet.getUTXO(secpUTXOIDs[0])

  output = secpUtxo.getOutput() as AmountOutput
  amt = output.getAmount().clone()
  txid = secpUtxo.getTxID()
  outputidx = secpUtxo.getOutputIdx()

  secpInput = new SECPTransferInput(amt)
  secpInput.addSignatureIdx(0, xAddresses[0])

  transferableInput = new TransferableInput(txid, outputidx, assetID, secpInput)
  ins.push(transferableInput)
  
  const payload: Buffer = memo
  let utxoids: string[] = getUTXOIDs(utxoSet, id, AVMConstants.NFTMINTOUTPUTID)
  utxo = utxoSet.getUTXO(utxoids[0])
  let nftTransferOutput: NFTTransferOutput = utxo.getOutput() as NFTTransferOutput;
  let asOf: BN = UnixNow()
  let spenders: Buffer[] = nftTransferOutput.getSpenders(xAddresses, asOf)

  const nftMintOperation1: NFTMintOperation = new NFTMintOperation(0, payload, [new OutputOwners(xAddresses, locktime, threshold)])
//   const nftMintOperation2: NFTMintOperation = new NFTMintOperation(0, payload, [new OutputOwners(xAddresses, locktime, threshold)])
  spenders.forEach((spender: Buffer) => {
    let idx: number
    idx = nftTransferOutput.getAddressIdx(spender)
    if(idx == -1){
      throw new Error(`Error - no such address in output: ${spender}`)
    }
    nftMintOperation1.addSignatureIdx(idx, spender)
    // nftMintOperation2.addSignatureIdx(idx, spender)
  })
    
  let transferableOperation1: TransferableOperation = new TransferableOperation(utxo.getAssetID(), utxoids, nftMintOperation1)
  ops.push(transferableOperation1)
//   let transferableOperation2: TransferableOperation = new TransferableOperation(utxo.getAssetID(), utxoids, nftMintOperation2)
//   ops.push(transferableOperation2)

  let operationTx: OperationTx = new OperationTx(networkID, blockchainID, outs, ins, memo, ops)
  unsignedTx = new UnsignedTx(operationTx)
  tx = unsignedTx.sign(xKeychain)
  console.log(tx.toBuffer().toString('hex'))
  id = await avm.issueTx(tx)
  console.log(id)
}
  
main()
