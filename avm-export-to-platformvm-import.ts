const sleep = (ms: number): Promise<unknown> => {
  return new Promise( resolve => setTimeout(resolve, ms) )
}

import { Avalanche, BinTools, BN, Buffer } from "avalanche"
import { 
  AmountOutput as AVMAmountOutput,
  AVMAPI, 
  KeyChain as AVMKeyChain, 
  SECPTransferInput as AVMSECPTransferInput,
  SECPTransferOutput as  AVMSECPTransferOutput,
  TransferableInput as AVMTransferableInput,
  TransferableOutput as AVMTransferableOutput,
  Tx as AVMTx, 
  UnsignedTx as AVMUnsignedTx,
  UTXO as AVMUTXO,
  UTXOSet as AVMUTXOSet,
  ExportTx,
} from "avalanche/dist/apis/avm"
import { 
  AmountOutput as PlatformVMAmountOutput,
  ImportTx,
  PlatformVMAPI,
  SECPTransferInput as PlatformVMSECPInput,
  SECPTransferOutput as PlatformVMSECPOutput,
  TransferableInput as PlatformVMTransferableInput,
  TransferableOutput as PlatformVMTransferableOutput,
  KeyChain as PlatformVMKeyChain,
  Tx as PlatformVMTx, 
  UnsignedTx as PlatformVMUnsignedTx,
  UTXO as PlatformVMUTXO,
  UTXOSet as PlatformVMUTXOSet,
} from "avalanche/dist/apis/platformvm"
import { Defaults } from "avalanche/dist/utils/constants"

const ip: string = "localhost"
const protocol: string = "http"
const networkID: number = 12345
const port: number = 9650
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const bintools: BinTools = BinTools.getInstance()
const avm: AVMAPI = avalanche.XChain()
const platformvm: PlatformVMAPI = avalanche.PChain()
const avmBlockchainID: Buffer = bintools.cb58Decode(avm.getBlockchainID())
const platformvmBlockchainID: Buffer = bintools.cb58Decode(platformvm.getBlockchainID())
const xKeychain: AVMKeyChain = avm.keyChain()
const pKeychain: PlatformVMKeyChain = platformvm.keyChain()
const memo: Buffer = bintools.stringToBuffer("AvalancheJS")
xKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
const xAddresses: Buffer[] = avm.keyChain().getAddresses()
const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
pKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
const pAddresses: Buffer[] = platformvm.keyChain().getAddresses()
const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()
console.log(xAddressStrings)
console.log(pAddressStrings)
const locktime: BN = new BN(0)
const threshold: number = 1
const avmIns: AVMTransferableInput[] = []
const avmOuts: AVMTransferableOutput[] = []
const avmExportedOuts: AVMTransferableOutput[] = []
const platformvmIns: PlatformVMTransferableInput[] = []
const platformvmOuts: PlatformVMTransferableOutput[] = []
const importedIns: PlatformVMTransferableInput[] = []
const mstimeout: number = 5000

const main = async (): Promise<any> => {
  // step 1 Export from X Chain
  let assetID: Buffer = await avm.getAVAXAssetID()
  let result: any = await avm.getBalance(xAddressStrings[0], bintools.cb58Encode(assetID))
  let balance: BN = new BN(result.balance)
  let fee: BN = avm.getFee()
  const p: any = Defaults.network[4].P
  const platformVMAmount: BN = p.minStake.mul(new BN(2))
 
  const platformvmAmtfee: BN = platformVMAmount.add(platformvm.getFee())
  let avaxAmount: BN = balance.sub(fee).sub(platformvmAmtfee)
  const avmSECPTransferOutput: AVMSECPTransferOutput = new AVMSECPTransferOutput(avaxAmount, xAddresses, locktime, threshold)
  const avmTransferableOutput: AVMTransferableOutput =  new AVMTransferableOutput(assetID, avmSECPTransferOutput)
  avmOuts.push(avmTransferableOutput)

  const xferSecpOutput: AVMSECPTransferOutput = new AVMSECPTransferOutput(platformvmAmtfee, pAddresses, locktime, threshold)
  const exportTransferableOutput: AVMTransferableOutput =  new AVMTransferableOutput(assetID, xferSecpOutput)
  avmExportedOuts.push(exportTransferableOutput)

  const avmUTXOSet: AVMUTXOSet = await avm.getUTXOs([xAddressStrings[0]])
  const avmUTXO: AVMUTXO = avmUTXOSet.getAllUTXOs()[0]
  const avmAmountOutput: AVMAmountOutput = avmUTXO.getOutput() as AVMAmountOutput
  let amt: BN = avmAmountOutput.getAmount().clone()
  let txid: Buffer = avmUTXO.getTxID()
  let outputidx: Buffer = avmUTXO.getOutputIdx()

  const avmSECPTransferInput: AVMSECPTransferInput = new AVMSECPTransferInput(amt)
  avmSECPTransferInput.addSignatureIdx(0, xAddresses[0])

  const avmTransferableInput: AVMTransferableInput = new AVMTransferableInput(txid, outputidx, assetID, avmSECPTransferInput)
  avmIns.push(avmTransferableInput)

  const destinationChain: string = platformvm.getBlockchainID()
  const exportTx: ExportTx = new ExportTx(networkID, avmBlockchainID, avmOuts, avmIns, memo, bintools.cb58Decode(destinationChain), avmExportedOuts)
  const avmUnsignedTx: AVMUnsignedTx = new AVMUnsignedTx(exportTx)
  const avmTx: AVMTx = avmUnsignedTx.sign(xKeychain)
  let id: string = await avm.issueTx(avmTx)
  console.log(id)
  await sleep(mstimeout)

  // step Import to P-Chain
  assetID = await platformvm.getAVAXAssetID()
  result = await platformvm.getBalance(pAddressStrings[0])
  balance = new BN(result.balance)
  fee = platformvm.getFee()
  const sourceChain: string = avm.getBlockchainID()

  const platformvmUTXOSet: PlatformVMUTXOSet = await platformvm.getUTXOs([pAddressStrings[0]])
  const platformvmUTXO: PlatformVMUTXO = platformvmUTXOSet.getAllUTXOs()[0]
  const platformvmAmountOutput: PlatformVMAmountOutput = platformvmUTXO.getOutput() as PlatformVMAmountOutput
  amt = platformvmAmountOutput.getAmount().clone()
  txid = platformvmUTXO.getTxID()
  outputidx = platformvmUTXO.getOutputIdx()

  const platformVMSecpInput: PlatformVMSECPInput = new PlatformVMSECPInput(amt)
  platformVMSecpInput.addSignatureIdx(0, xAddresses[0])

  const platformVMTransferableInput: PlatformVMTransferableInput = new PlatformVMTransferableInput(txid, outputidx, assetID, platformVMSecpInput)
  platformvmIns.push(platformVMTransferableInput)

  const atomicUTXOs: PlatformVMUTXOSet = await platformvm.getUTXOs([pAddressStrings[0]], sourceChain)
  const atomics: PlatformVMUTXO[] = atomicUTXOs.getAllUTXOs()
  const atomicplatformVMUTXO: PlatformVMUTXO = atomics[0]
  const atomicplatformVMAmountOutput: PlatformVMAmountOutput = atomicplatformVMUTXO.getOutput() as PlatformVMAmountOutput
  amt = atomicplatformVMAmountOutput.getAmount().clone()

  avaxAmount = balance.sub(fee).add(amt)
  const platformVMSECPOutput: PlatformVMSECPOutput = new PlatformVMSECPOutput(avaxAmount, xAddresses, locktime, threshold)
  const platformVMTransferableOutput: PlatformVMTransferableOutput =  new PlatformVMTransferableOutput(assetID, platformVMSECPOutput)
  platformvmOuts.push(platformVMTransferableOutput)

  txid = atomicplatformVMUTXO.getTxID()
  outputidx = atomicplatformVMUTXO.getOutputIdx()
  const atomicPlatformVMSecpInput: PlatformVMSECPInput = new PlatformVMSECPInput(amt)
  const atomicPlatformVMTransferableInput: PlatformVMTransferableInput = new PlatformVMTransferableInput(txid, outputidx, assetID, atomicPlatformVMSecpInput)
  const from: Buffer[] = atomicplatformVMAmountOutput.getAddresses()
  const spenders: Buffer[] = atomicplatformVMAmountOutput.getSpenders(from)
  spenders.forEach((spender: Buffer) => {
    const idx: number = atomicplatformVMAmountOutput.getAddressIdx(spender)
    atomicPlatformVMTransferableInput.getInput().addSignatureIdx(idx, spender)
  })
  importedIns.push(atomicPlatformVMTransferableInput)

  const importTx: ImportTx = new ImportTx(networkID, platformvmBlockchainID, platformvmOuts, platformvmIns, memo, bintools.cb58Decode(sourceChain), importedIns)
  const platformVMUnsignedTx: PlatformVMUnsignedTx = new PlatformVMUnsignedTx(importTx)
  const platformVMTx: PlatformVMTx = platformVMUnsignedTx.sign(pKeychain)
  id = await platformvm.issueTx(platformVMTx)
  console.log(id)
}
  
main()
