import { 
  Avalanche, 
  BinTools, 
  BN, 
  Buffer 
} from "avalanche"
import { 
  AmountOutput,
  AVMAPI, 
  KeyChain, 
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
const xKeychain: KeyChain = avm.keyChain()
const memo: Buffer = bintools.stringToBuffer("Avalanche.js")
xKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
const xAddresses: Buffer[] = avm.keyChain().getAddresses()
const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
const amount: BN = new BN(991999996000000)
const fee: BN = avm.getTxFee()
const locktime: BN = new BN(0)
const threshold: number = 1
const ins: TransferableInput[] = []
const outs: TransferableOutput[] = []

const main = async (): Promise<any> => {
  const assetID: Buffer = await avm.getAVAXAssetID()
  const res: any = await avm.getBalance(xAddressStrings[0], "AVAX")
  console.log(res['balance'])
  const secpOutput1: SECPTransferOutput = new SECPTransferOutput(amount, xAddresses, locktime, threshold)
  const transferableOutput1: TransferableOutput =  new TransferableOutput(assetID, secpOutput1)
  outs.push(transferableOutput1)

//   const avmu = await avm.getUTXOs([xAddressStrings[0]])
//   const utxoSet: UTXOSet = avmu.utxos 
//   const utxo: UTXO = utxoSet.getAllUTXOs()[0]
//   const output: AmountOutput = utxo.getOutput() as AmountOutput
//   const amt: BN = output.getAmount().clone()
//   const txid: Buffer = utxo.getTxID()
//   const outputidx: Buffer = utxo.getOutputIdx()

//   const secpInput: SECPTransferInput = new SECPTransferInput(amt)
//   secpInput.addSignatureIdx(0, xAddresses[0])

//   const transferableInput: TransferableInput = new TransferableInput(txid, outputidx, assetid, secpInput)
//   ins.push(transferableInput)

//   const baseTx:BaseTx = new BaseTx(networkID, blockchainID, outs, ins, memo)
//   const unsignedTx: UnsignedTx = new UnsignedTx(baseTx)
//   const tx: Tx = unsignedTx.sign(xKeychain)
//   const id: string = await avm.issueTx(tx)
//   console.log(id)
}
  
main()
