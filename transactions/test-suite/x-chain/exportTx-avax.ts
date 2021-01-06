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
  // import { privKey } from '../common/values'
    
  const ip: string = "localhost"
  const port: number = 9650
  const protocol: string = "http"
  const networkID: number = 5 
  const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
  const xchain: AVMAPI = avalanche.XChain()
  const bintools: BinTools = BinTools.getInstance()
  const xKeychain: AVMKeyChain = xchain.keyChain()
  const privKey: string = "PrivateKey-2oRwepS7x9QajgfwW3vVdzYXQ8tcTPBkF3nBz2cfV8MX77GMG"
  xKeychain.importKey(privKey)
  const xAddresses: Buffer[] = xchain.keyChain().getAddresses()
  const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
  console.log(xAddressStrings)
  const blockchainid: string = "2JVSBoinj9C2J33VntvzYtVJNZdN2NKiwwKjcumHUWEb5DbBrm" // X-Chain
  const cChainBlockchainID: string = "yH8D7ThNJkxmtkuv2jgBa4P1Rn3Qpr4pPr7QYNfcdoS6k6HWp" // X-Chain
  const avaxAssetID: string = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK"
  const exportedOuts: TransferableOutput[] = []
  const outputs: TransferableOutput[] = []
  const inputs: TransferableInput[] = []
  const fee: BN = new BN(1000000)
  const threshold: number = 1
  const avaxAmount: BN = new BN(1000000000)
  const locktime: BN = new BN(0)
  const memo: Buffer = bintools.stringToBuffer("Export from X-Chain to C-Chain")
    
  const main = async (): Promise<any> => {
    const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(avaxAmount.sub(fee), xAddresses, locktime, threshold)
    const transferableOutput: TransferableOutput = new TransferableOutput(bintools.cb58Decode(avaxAssetID), secpTransferOutput)
    exportedOuts.push(transferableOutput)

    const u: any = await xchain.getUTXOs(xAddressStrings)
    const utxoSet: UTXOSet = u.utxos
    // console.log(utxoSet)
    // return false;
    const utxo: UTXO = utxoSet.getAllUTXOs()[0]
    const amountOutput: AmountOutput = utxo.getOutput() as AmountOutput
    const amt: BN = amountOutput.getAmount().clone()
    const txid: Buffer = utxo.getTxID()
    const outputidx: Buffer = utxo.getOutputIdx()

    const secpTransferInput: SECPTransferInput = new SECPTransferInput(amt)
    secpTransferInput.addSignatureIdx(0, xAddresses[0])

    const input: TransferableInput = new TransferableInput(txid, outputidx, bintools.cb58Decode(avaxAssetID), secpTransferInput)
    inputs.push(input)

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
    // console.log(tx.toBuffer().toString('hex'))
    const id: string = await xchain.issueTx(tx)
    console.log(id)
  }
  
  main()
  