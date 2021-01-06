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
    TransferableOutput,
    TransferableInput,
    UTXOSet,
    UTXO,
    AmountOutput,
    UnsignedTx,
    Tx,
    SECPMintOutput,
    OperationTx,
    TransferableOperation,
    AVMConstants,
    SECPMintOperation
  } from "avalanche/dist/apis/avm"

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
  const xKeychain: AVMKeyChain = xchain.keyChain()
  const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
  xKeychain.importKey(privKey)
  const xAddresses: Buffer[] = xchain.keyChain().getAddresses()
  const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
  const blockchainid: string = "2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed" // X-Chain
  const avaxAssetID: string = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"
  const outputs: TransferableOutput[] = []
  const inputs: TransferableInput[] = []
  const operations: TransferableOperation[] = []
  const fee: BN = new BN(1000000)
  const threshold: number = 1
  const locktime: BN = new BN(0)
  const memo: Buffer = bintools.stringToBuffer("AVM BaseTx")
    
  const main = async (): Promise<any> => {
    const u: any = await xchain.getUTXOs(xAddressStrings)
    const utxoSet: UTXOSet = u.utxos
    const utxos: UTXO[] = utxoSet.getAllUTXOs()
    utxos.forEach((utxo: UTXO) => {
      if(utxo.getOutput().getTypeID() != 6) {
        const amountOutput: AmountOutput = utxo.getOutput() as AmountOutput
        const amt: BN = amountOutput.getAmount().clone()
        const txid: Buffer = utxo.getTxID()
        const outputidx: Buffer = utxo.getOutputIdx()
        const assetID: Buffer = utxo.getAssetID();

        if(assetID.toString('hex') === bintools.cb58Decode(avaxAssetID).toString('hex')) {
          const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(amt.sub(fee), xAddresses, locktime, threshold)
          const transferableOutput: TransferableOutput = new TransferableOutput(bintools.cb58Decode(avaxAssetID), secpTransferOutput)
          outputs.push(transferableOutput)
  
          const secpTransferInput: SECPTransferInput = new SECPTransferInput(amt)
          secpTransferInput.addSignatureIdx(0, xAddresses[0])
          const input: TransferableInput = new TransferableInput(txid, outputidx, bintools.cb58Decode(avaxAssetID), secpTransferInput)
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
        const assetID: string = "4GKpdC31MG1588M2TLHT4eYzdFkQw4bFE2xR2vU7fhhVN6WJW"
        // const secpMintOutput: SECPMintOutput = new SECPMintOutput(xAddresses, locktime, threshold)
        // const mintTransferableOutput: TransferableOutput = new TransferableOutput(bintools.cb58Decode(assetID), secpMintOutput)
        // outputs.push(mintTransferableOutput)

        let txID: string = "24yshmQWrgSZ9DpN1eKtFqauAmga4q7HyjWLzncx9246grBtBz"

        let vcapAmount: BN = new BN(507)
        let vcapSecpTransferOutput: SECPTransferOutput = new SECPTransferOutput(vcapAmount, xAddresses, locktime, threshold)
        let secpMintOutputUTXOIDs: string[] = getUTXOIDs(utxoSet, txID, AVMConstants.SECPMINTOUTPUTID, assetID)
        // console.log(secpMintOutputUTXOIDs)
        let mintOwner: SECPMintOutput = utxo.getOutput() as SECPMintOutput 

        const secpMintOperation: SECPMintOperation = new SECPMintOperation(mintOwner, vcapSecpTransferOutput)

        let spenders: Buffer[] = mintOwner.getSpenders(xAddresses)

        spenders.forEach((spender: Buffer) => {
          const idx: number = mintOwner.getAddressIdx(spender)
          secpMintOperation.addSignatureIdx(idx, spender)
        })
    
        let transferableOperation: TransferableOperation = new TransferableOperation(utxo.getAssetID(), secpMintOutputUTXOIDs, secpMintOperation)
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
    // console.log(operationTx)
    const unsignedTx: UnsignedTx = new UnsignedTx(operationTx)
    const tx: Tx = unsignedTx.sign(xKeychain)
    console.log(tx.toBuffer().toString('hex'))
    const id: string = await xchain.issueTx(tx)
    console.log(id)
  }
  
  main()
  