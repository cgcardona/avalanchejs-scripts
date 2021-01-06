import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from "avalanche"
import {
  AVMAPI, 
  KeyChain,
  SECPTransferOutput,
  SECPTransferInput,
  TransferableOutput,
  TransferableInput,
  UTXOSet,
  UTXO,
  AmountOutput,
  UnsignedTx,
  Tx,
  OperationTx,
  TransferableOperation,
  AVMConstants,
  NFTMintOperation,
  NFTMintOutput
} from "avalanche/dist/apis/avm"
import { 
  iAVMUTXOResponse 
} from "avalanche/dist/apis/avm/interfaces"
import { OutputOwners } from "avalanche/dist/common"
import { Defaults } from "avalanche/dist/utils"

const getUTXOIDs = (utxoSet: UTXOSet, txid: string, outputType: number = AVMConstants.SECPXFEROUTPUTID_CODECONE, assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"): string[] => {
const utxoids: string[] = utxoSet.getUTXOIDs()
let result: string[] = []
for (let index: number = 0; index < utxoids.length; ++index) {
  if (utxoids[index].indexOf(txid.slice(0,10)) != -1 && utxoSet.getUTXO(utxoids[index]).getOutput().getOutputID() == outputType && assetID == bintools.cb58Encode(utxoSet.getUTXO(utxoids[index]).getAssetID())) {
    result.push(utxoids[index])
  }
}
return result
}
    
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: KeyChain = xchain.keyChain()
const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
xKeychain.importKey(privKey)
const xAddresses: Buffer[] = xchain.keyChain().getAddresses()
const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
const blockchainid: string = Defaults.network['12345'].X.blockchainID
const outputs: TransferableOutput[] = []
const inputs: TransferableInput[] = []
const operations: TransferableOperation[] = []
const fee: BN = xchain.getDefaultTxFee()
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = bintools.stringToBuffer("AVM manual OperationTx to mint an NFT")
const payload: Buffer = bintools.stringToBuffer("NFT Payload")
const groupID: number = 0
    
const main = async (): Promise<any> => {
  const avaxAssetID: Buffer = await xchain.getAVAXAssetID()
  const avmUTXOResponse: iAVMUTXOResponse = await xchain.getUTXOs(xAddressStrings)
  const utxoSet: UTXOSet = avmUTXOResponse.utxos
  const utxos: UTXO[] = utxoSet.getAllUTXOs()
  utxos.forEach((utxo: UTXO) => {
    const txid: Buffer = utxo.getTxID()
    const outputidx: Buffer = utxo.getOutputIdx()
    const assetID: Buffer = utxo.getAssetID();
    if(utxo.getOutput().getTypeID() != 10) {
      const amountOutput: AmountOutput = utxo.getOutput() as AmountOutput
      const amt: BN = amountOutput.getAmount().clone()

      if(assetID.toString('hex') === avaxAssetID.toString('hex')) {
        const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(amt.sub(fee), xAddresses, locktime, threshold)
        const transferableOutput: TransferableOutput = new TransferableOutput(avaxAssetID, secpTransferOutput)
        outputs.push(transferableOutput)
  
        const secpTransferInput: SECPTransferInput = new SECPTransferInput(amt)
        secpTransferInput.addSignatureIdx(0, xAddresses[0])
        const input: TransferableInput = new TransferableInput(txid, outputidx, avaxAssetID, secpTransferInput)
        inputs.push(input)
      } else {
        const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(amt, xAddresses, locktime, threshold)
        const transferableOutput: TransferableOutput = new TransferableOutput(assetID, secpTransferOutput)
        outputs.push(transferableOutput)
  
        const secpTransferInput: SECPTransferInput = new SECPTransferInput(amt)
        secpTransferInput.addSignatureIdx(0, xAddresses[0])
        const input: TransferableInput = new TransferableInput(txid, outputidx, assetID, secpTransferInput)
        inputs.push(input)
      }
    } else {
      const outputOwners: OutputOwners = new OutputOwners(xAddresses, locktime, threshold)
      const nftMintOutputUTXOIDs: string[] = getUTXOIDs(utxoSet, bintools.cb58Encode(txid), AVMConstants.NFTMINTOUTPUTID, bintools.cb58Encode(assetID))
      const mintOwner: NFTMintOutput = utxo.getOutput() as NFTMintOutput 
      const nftMintOperation: NFTMintOperation = new NFTMintOperation(groupID, payload, [outputOwners])
      const spenders: Buffer[] = mintOwner.getSpenders(xAddresses)

      spenders.forEach((spender: Buffer) => {
        const idx: number = mintOwner.getAddressIdx(spender)
        nftMintOperation.addSignatureIdx(idx, spender)
      })
    
      const transferableOperation: TransferableOperation = new TransferableOperation(utxo.getAssetID(), nftMintOutputUTXOIDs, nftMintOperation)
      operations.push(transferableOperation)
    }
  })
  const operationTx: OperationTx = new OperationTx (
    networkID,
    bintools.cb58Decode(blockchainid),
    outputs,
    inputs,
    memo,
    operations
  )
  const unsignedTx: UnsignedTx = new UnsignedTx(operationTx)
  const tx: Tx = unsignedTx.sign(xKeychain)
  const id: string = await xchain.issueTx(tx)
  console.log(id)
}
  
main()
  