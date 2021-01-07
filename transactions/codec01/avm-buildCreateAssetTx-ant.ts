import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from "avalanche"
import {
  AVMAPI, 
  KeyChain as AVMKeyChain,
  SECPTransferOutput,
  SECPTransferInput,
  TransferableInput,
  UTXOSet,
  UTXO,
  AmountOutput,
  UnsignedTx,
  Tx,
  InitialStates,
  SECPMintOutput
} from "avalanche/dist/apis/avm"
import { 
  iAVMUTXOResponse 
} from "avalanche/dist/apis/avm/interfaces"
    
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
const outputs: SECPMintOutput[] = []
const inputs: TransferableInput[] = []
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = bintools.stringToBuffer("AVM utility method buildCreateAssetTx to create an ANT")
const name: string = "TestToken"
const symbol: string = "TEST"
const denomination: number = 3
    
const main = async (): Promise<any> => {
  const avaxAssetID: Buffer = await xchain.getAVAXAssetID()
  const avmUTXOResponse: iAVMUTXOResponse = await xchain.getUTXOs(xAddressStrings)
  const utxoSet: UTXOSet = avmUTXOResponse.utxos
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

  const amount: BN = new BN(507)
  const vcapSecpOutput = new SECPTransferOutput(amount, xAddresses, locktime, threshold)
  const secpMintOutput: SECPMintOutput = new SECPMintOutput(xAddresses, locktime, threshold)

  const initialStates: InitialStates = new InitialStates()
  initialStates.addOutput(vcapSecpOutput)
  outputs.push(secpMintOutput)

  const unsignedTx: UnsignedTx = await xchain.buildCreateAssetTx(
    utxoSet,
    xAddressStrings,
    xAddressStrings,
    initialStates,
    name,
    symbol,
    denomination,
    outputs,
    memo
  )

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
  