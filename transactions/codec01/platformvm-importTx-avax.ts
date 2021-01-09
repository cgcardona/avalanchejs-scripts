import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from "avalanche"
import {
  PlatformVMAPI,
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
} from "avalanche/dist/apis/platformvm"
import { Defaults } from "avalanche/dist/utils"
import { iPlatformVMUTXOResponse } from "avalanche/dist/apis/platformvm/interfaces"
    
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345 
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const pchain: PlatformVMAPI = avalanche.PChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: AVMKeyChain = pchain.keyChain()
const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
xKeychain.importKey(privKey)
const pAddresses: Buffer[] = pchain.keyChain().getAddresses()
const pAddressStrings: string[] = pchain.keyChain().getAddressStrings()
const xChainID: string = Defaults.network['12345'].X.blockchainID
const pChainID: string = Defaults.network['12345'].P.blockchainID
const importedInputs: TransferableInput[] = []
const outputs: TransferableOutput[] = []
const inputs: TransferableInput[] = []
const fee: BN = pchain.getDefaultTxFee()
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = bintools.stringToBuffer("Manually Import AVAX to the P-Chain from the X-Chain")
    
const main = async (): Promise<any> => {
  const avaxAssetID: Buffer = await pchain.getAVAXAssetID()
  const platformvmUTXOResponse: iPlatformVMUTXOResponse = await pchain.getUTXOs(pAddressStrings, xChainID)
  const utxoSet: UTXOSet = platformvmUTXOResponse.utxos
  const utxo: UTXO = utxoSet.getAllUTXOs()[0]
  const amountOutput: AmountOutput = utxo.getOutput() as AmountOutput
  const amt: BN = amountOutput.getAmount().clone()
  const txid: Buffer = utxo.getTxID()
  const outputidx: Buffer = utxo.getOutputIdx()

  const secpTransferInput: SECPTransferInput = new SECPTransferInput(amt)
  secpTransferInput.addSignatureIdx(0, pAddresses[0])

  const input: TransferableInput = new TransferableInput(txid, outputidx, avaxAssetID, secpTransferInput)
  importedInputs.push(input)

  const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(amt.sub(fee), pAddresses, locktime, threshold)
  const transferableOutput: TransferableOutput = new TransferableOutput(avaxAssetID, secpTransferOutput)
  outputs.push(transferableOutput)

  const importTx: ImportTx = new ImportTx(
    networkID,
    bintools.cb58Decode(pChainID),
    outputs,
    inputs,
    memo,
    bintools.cb58Decode(xChainID),
    importedInputs
  )
  const unsignedTx: UnsignedTx = new UnsignedTx(importTx)

  const tx: Tx = unsignedTx.sign(xKeychain)
  const id: string = await pchain.issueTx(tx)
  console.log(id)
}
  
main()
  