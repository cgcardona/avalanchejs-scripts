import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from "avalanche"
import {
  AVMAPI, 
  ExportTx,
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
const blockchainid: string = Defaults.network['12345'].X.blockchainID
//   const cChainBlockchainID: string = Defaults.network['12345'].C.blockchainID
const cChainBlockchainID: string = "2Z9cLs2fVMZ5xjBQ8epCqxrVtHMeS1Hp2SXQrv85be7b5KmeQd"
const exportedOuts: TransferableOutput[] = []
const outputs: TransferableOutput[] = []
const inputs: TransferableInput[] = []
const fee: BN = xchain.getDefaultTxFee()
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = bintools.stringToBuffer("Manually Export AVAX from X-Chain to C-Chain")
    
const main = async (): Promise<any> => {
  const avaxAssetID: Buffer = await xchain.getAVAXAssetID()
  const b: any = await xchain.getBalance(xAddressStrings[0], bintools.cb58Encode(avaxAssetID))
  const balance: BN = new BN(b.balance)
  const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(balance.sub(fee), xAddresses, locktime, threshold)
  const transferableOutput: TransferableOutput = new TransferableOutput(avaxAssetID, secpTransferOutput)
  exportedOuts.push(transferableOutput)

  const u: any = await xchain.getUTXOs(xAddressStrings)
  const utxoSet: UTXOSet = u.utxos
  const utxos: UTXO[] = utxoSet.getAllUTXOs()
  utxos.forEach((utxo: UTXO) => {
    const amountOutput: AmountOutput = utxo.getOutput() as AmountOutput
    const amt: BN = amountOutput.getAmount().clone()
    const txid: Buffer = utxo.getTxID()
    const outputidx: Buffer = utxo.getOutputIdx()

    const secpTransferInput: SECPTransferInput = new SECPTransferInput(amt)
    secpTransferInput.addSignatureIdx(0, xAddresses[0])

    const input: TransferableInput = new TransferableInput(txid, outputidx, avaxAssetID, secpTransferInput)
    inputs.push(input)
  })

  const exportTx: ExportTx = new ExportTx(
    networkID,
    bintools.cb58Decode(blockchainid),
    outputs,
    inputs,
    memo,
    bintools.cb58Decode(cChainBlockchainID),
    exportedOuts
  )
  const unsignedTx: UnsignedTx = new UnsignedTx(exportTx)
  const tx: Tx = unsignedTx.sign(xKeychain)
  const id: string = await xchain.issueTx(tx)
  console.log(id)
}
  
main()
  