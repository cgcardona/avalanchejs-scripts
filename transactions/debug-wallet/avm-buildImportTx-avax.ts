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
const cChainBlockchainID: string = Defaults.network['12345'].C.blockchainID
const avaxAssetID: string = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK"
const importedInputs: TransferableInput[] = []
const outputs: TransferableOutput[] = []
const inputs: TransferableInput[] = []
const fee: BN = new BN(1000000)
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = bintools.stringToBuffer("Import to X-Chain the C-Chain")
    
const main = async (): Promise<any> => {
  const u: any = await xchain.getUTXOs(xAddressStrings, cChainBlockchainID)
  const utxoSet: UTXOSet = u.utxos
  const utxo: UTXO = utxoSet.getAllUTXOs()[0]
  const amountOutput: AmountOutput = utxo.getOutput() as AmountOutput
  const amt: BN = amountOutput.getAmount().clone()
  const txid: Buffer = utxo.getTxID()
  const outputidx: Buffer = utxo.getOutputIdx()

  const secpTransferInput: SECPTransferInput = new SECPTransferInput(amt)
  secpTransferInput.addSignatureIdx(0, xAddresses[0])

  const input: TransferableInput = new TransferableInput(txid, outputidx, bintools.cb58Decode(avaxAssetID), secpTransferInput)
  importedInputs.push(input)

  const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(amt.sub(fee), xAddresses, locktime, threshold)
  const transferableOutput: TransferableOutput = new TransferableOutput(bintools.cb58Decode(avaxAssetID), secpTransferOutput)
  outputs.push(transferableOutput)
  const avmu: any = await xchain.getUTXOs([xAddressStrings[0]])
  const avmUTXOSet = avmu.utxos

  const unsignedTx: UnsignedTx = await xchain.buildImportTx(
    avmUTXOSet,
    xAddressStrings,
    cChainBlockchainID,
    xAddressStrings,
    xAddressStrings,
    xAddressStrings,
    memo
  )
  const tx: Tx = unsignedTx.sign(xKeychain)
  const id: string = await xchain.issueTx(tx)
  console.log(id)
}
  
main()
  