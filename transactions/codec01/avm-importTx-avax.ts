import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from "avalanche"
import {
  AVMAPI, 
  ImportTx,
  KeyChain as AVMKeyChain,
  SECPTransferOutput,
  SECPTransferInput,
  TransferableOutput,
  TransferableInput,
  UTXOSet,
  UTXO,
  AmountOutput,
  UnsignedTx,
  Tx
} from "avalanche/dist/apis/avm"
import { iAVMUTXOResponse } from "avalanche/dist/apis/avm/interfaces"
import { Defaults } from "avalanche/dist/utils"
    
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345 
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: AVMKeyChain = xchain.keyChain()
const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
xKeychain.importKey(privKey)
const xAddresses: Buffer[] = xchain.keyChain().getAddresses()
const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
const blockchainid: string = Defaults.network['12345'].X.blockchainID
//   const cChainBlockchainID: string = Defaults.network['12345'].C.blockchainID
const cChainBlockchainID: string = "2Z9cLs2fVMZ5xjBQ8epCqxrVtHMeS1Hp2SXQrv85be7b5KmeQd"
const importedInputs: TransferableInput[] = []
const outputs: TransferableOutput[] = []
const inputs: TransferableInput[] = []
const fee: BN = xchain.getDefaultTxFee()
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = bintools.stringToBuffer("Manually Import AVAX to the X-Chain from the C-Chain")
    
const main = async (): Promise<any> => {
  const avaxAssetID: Buffer = await xchain.getAVAXAssetID()
  const avmUTXOResponse: iAVMUTXOResponse = await xchain.getUTXOs(xAddressStrings, cChainBlockchainID)
  const utxoSet: UTXOSet = avmUTXOResponse.utxos
  const utxo: UTXO = utxoSet.getAllUTXOs()[0]
  const amountOutput: AmountOutput = utxo.getOutput() as AmountOutput
  const amt: BN = amountOutput.getAmount().clone()
  const txid: Buffer = utxo.getTxID()
  const outputidx: Buffer = utxo.getOutputIdx()

  const secpTransferInput: SECPTransferInput = new SECPTransferInput(amt)
  secpTransferInput.addSignatureIdx(0, xAddresses[0])

  const input: TransferableInput = new TransferableInput(txid, outputidx, avaxAssetID, secpTransferInput)
  importedInputs.push(input)

  const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(amt.sub(fee), xAddresses, locktime, threshold)
  const transferableOutput: TransferableOutput = new TransferableOutput(avaxAssetID, secpTransferOutput)
  outputs.push(transferableOutput)

  const exportTx: ImportTx = new ImportTx(
    networkID,
    bintools.cb58Decode(blockchainid),
    outputs,
    inputs,
    memo,
    bintools.cb58Decode(cChainBlockchainID),
    importedInputs
  )
  const unsignedTx: UnsignedTx = new UnsignedTx(exportTx)

  // start uncomment for codecID 00 00
  // const tx: Tx = unsignedTx.sign(xKeychain)
  // const id: string = await xchain.issueTx(tx)
  // stop uncomment for codecID 00 00

  // start uncomment for codecID 00 01
  const codecID: number = 1
  const tx: Tx = unsignedTx.sign(xKeychain, codecID)
  const cb58EncodedTx: string = bintools.cb58Encode(tx.toBuffer(codecID))
  const id: string = await xchain.issueTx(cb58EncodedTx)
  // stop uncomment for codecID 00 01

  console.log(id)
}
  
main()
  