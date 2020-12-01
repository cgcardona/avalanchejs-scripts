// import { Avalanche, BinTools, BN } from "avalanche"
// import { Buffer } from 'buffer/'
// import { 
//   AmountOutput,
//   AVMAPI, 
//   AVMConstants,
//   AVMKeyChain, 
//   BaseTx,
//   CreateAssetTx,
//   InitialStates,
//   OperationTx,
//   SECPTransferInput,
//   SECPTransferOutput,
//   SECPMintOperation,
//   SECPMintOutput,
//   TransferableInput,
//   TransferableOperation,
//   TransferableOutput,
//   Tx, 
//   UnsignedTx,
//   UTXO,
//   UTXOSet,
// } from "avalanche/dist/apis/avm"

// const sleep = (ms: number): Promise<unknown> => {
//   return new Promise( resolve => setTimeout(resolve, ms) )
// }

// const getUTXOIDs = (utxoSet: UTXOSet, txid: string, outputType: number = AVMConstants.SECPXFEROUTPUTID, assetID = "SSUAMrVdqYuvybAMGNitTYSAnE4T5fVdVDB82ped1qQ9f8DDM"): string[] => {
//   const utxoids: string[] = utxoSet.getUTXOIDs()
//   let result: string[] = []
//   for (let index: number = 0; index < utxoids.length; ++index) {
//     if (utxoids[index].indexOf(txid.slice(0,10)) != -1 && utxoSet.getUTXO(utxoids[index]).getOutput().getOutputID() == outputType && assetID == bintools.cb58Encode(utxoSet.getUTXO(utxoids[index]).getAssetID())) {
//       result.push(utxoids[index])
//     }
//   }
//   return result
// }

// const ip: string = "localhost"
// const protocol: string = "http"
// const networkID: number = 12345
// const port: number = 9650
// const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
// const bintools: BinTools = BinTools.getInstance()
// const avm: AVMAPI = avalanche.XChain()
// const blockchainID: Buffer = bintools.cb58Decode(avm.getBlockchainID())
// const xKeychain: AVMKeyChain = avm.keyChain()
// const memo: Buffer = bintools.stringToBuffer("Avalanche.js")
// xKeychain.importKey("PrivateKey-")
// const xAddresses: Buffer[] = avm.keyChain().getAddresses()
// const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
// console.log(xAddressStrings)
// const locktime: BN = new BN(0)
// const threshold: number = 1
// let ins: TransferableInput[] = []
// let outs: TransferableOutput[] = []
// let ops: TransferableOperation[] = []
// const mstimeout: number = 4000

// const main = async (): Promise<any> => {
//   const assetID: Buffer = await avm.getAVAXAssetID()
//   let result: any = await avm.getBalance(xAddressStrings[0], bintools.cb58Encode(assetID))
//   let balance: BN = new BN(result.balance)
//   let fee: BN = avm.getFee()
//   let avaxAmount: BN = balance.sub(fee)
//   let vcapAmount: BN = new BN(1000000000000507)
//   let secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(avaxAmount, xAddresses, locktime, threshold)
//   let transferableOutput: TransferableOutput =  new TransferableOutput(assetID, secpTransferOutput)
//   outs.push(transferableOutput)

//   let utxoSet: UTXOSet = await avm.getUTXOs([xAddressStrings[0]])
//   let utxo: UTXO = utxoSet.getAllUTXOs()[0]
//   let output: AmountOutput = utxo.getOutput() as AmountOutput
//   let amt: BN = output.getAmount().clone()
//   let txid: Buffer = utxo.getTxID()
//   let outputidx: Buffer = utxo.getOutputIdx()

//   let secpTransferInput: SECPTransferInput = new SECPTransferInput(amt)
//   secpTransferInput.addSignatureIdx(0, xAddresses[0])

//   let transferableInput: TransferableInput = new TransferableInput(txid, outputidx, assetID, secpTransferInput)
//   ins.push(transferableInput)

//   const name: string = "variable capped asset" 
//   const symbol: string = "VCAP" 
//   const denomination: number = 30
//   const vcapSecpOutput = new SECPTransferOutput(vcapAmount, xAddresses, locktime, threshold)
//   let secpMintOutput: SECPMintOutput = new SECPMintOutput(xAddresses, locktime, threshold)

//   const initialStates: InitialStates = new InitialStates()
//   initialStates.addOutput(vcapSecpOutput)
//   initialStates.addOutput(secpMintOutput)

//   const createAssetTx: CreateAssetTx = new CreateAssetTx(networkID, blockchainID, outs, ins, memo, name, symbol, denomination, initialStates)
//   let unsignedTx: UnsignedTx = new UnsignedTx(createAssetTx)
//   let tx: Tx = unsignedTx.sign(xKeychain)
//   let id: string = await avm.issueTx(tx)
//   console.log(id)
//   await sleep(mstimeout)
//   ins = []
//   outs = []
//   result = await avm.getBalance(xAddressStrings[0], bintools.cb58Encode(assetID))
//   balance = new BN(result.balance)
//   avaxAmount = balance.sub(fee)

//   vcapAmount = new BN(1000000000000507)

//   let changeSecpTransferOutput: SECPTransferOutput = new SECPTransferOutput(avaxAmount, xAddresses, locktime, threshold)
//   let changeTransferableOutput: TransferableOutput =  new TransferableOutput(assetID, changeSecpTransferOutput)
//   outs.push(changeTransferableOutput)

//   let vcapSecpTransferOutput: SECPTransferOutput = new SECPTransferOutput(vcapAmount, xAddresses, locktime, threshold)

//   utxoSet = await avm.getUTXOs(xAddressStrings)
//   let secpXferOutputUTXOIDs: string[] = getUTXOIDs(utxoSet, id, AVMConstants.SECPXFEROUTPUTID)
//   let secpXferUtxo: UTXO = utxoSet.getUTXO(secpXferOutputUTXOIDs[0])

//   output = secpXferUtxo.getOutput() as AmountOutput
//   amt = output.getAmount().clone()
//   txid = secpXferUtxo.getTxID()
//   outputidx = secpXferUtxo.getOutputIdx()

//   secpTransferInput = new SECPTransferInput(amt)
//   secpTransferInput.addSignatureIdx(0, xAddresses[0])

//   transferableInput = new TransferableInput(txid, outputidx, assetID, secpTransferInput)
//   ins.push(transferableInput)

//   let secpMintOutputUTXOIDs: string[] = getUTXOIDs(utxoSet, id, AVMConstants.SECPMINTOUTPUTID, id)

//   utxo = utxoSet.getUTXO(secpMintOutputUTXOIDs[0])
//   let mintOwner: SECPMintOutput = utxo.getOutput() as SECPMintOutput 

//   const secPMintOperation: SECPMintOperation = new SECPMintOperation(mintOwner, [vcapSecpTransferOutput])

//   let spenders: Buffer[] = mintOwner.getSpenders(xAddresses)

//   spenders.forEach((spender: Buffer) => {
//     const idx: number = mintOwner.getAddressIdx(spender)
//     secPMintOperation.addSignatureIdx(idx, spender)
//   })
    
//   let transferableOperation: TransferableOperation = new TransferableOperation(utxo.getAssetID(), secpMintOutputUTXOIDs, secPMintOperation)
//   ops.push(transferableOperation)

//   let operationTx: OperationTx = new OperationTx(networkID, blockchainID, outs, ins, memo, ops)
//   unsignedTx = new UnsignedTx(operationTx)
//   tx = unsignedTx.sign(xKeychain)
//   let id2: string = await avm.issueTx(tx)
//   console.log(id2)
//   await sleep(mstimeout)

//   ins = []
//   outs = []
//   result = await avm.getBalance(xAddressStrings[0], bintools.cb58Encode(assetID))
//   balance = new BN(result.balance)
//   avaxAmount = balance.sub(fee)

//   vcapAmount = new BN(50)

//   changeSecpTransferOutput = new SECPTransferOutput(avaxAmount, xAddresses, locktime, threshold)
//   changeTransferableOutput =  new TransferableOutput(assetID, changeSecpTransferOutput)
//   outs.push(changeTransferableOutput)

//   const addy: string = "X-local1l2rrd8q539ervnwle72st4sqsn2n90tf5pzvfa"
//   vcapSecpTransferOutput = new SECPTransferOutput(vcapAmount, [bintools.stringToAddress(addy)], locktime, threshold)
//   let vcapTransferableOutput: TransferableOutput =  new TransferableOutput(bintools.cb58Decode(id), vcapSecpTransferOutput)
//   outs.push(vcapTransferableOutput)

//   utxoSet = await avm.getUTXOs(xAddressStrings)
//   secpXferOutputUTXOIDs = getUTXOIDs(utxoSet, id2, AVMConstants.SECPXFEROUTPUTID)
//   secpXferUtxo = utxoSet.getUTXO(secpXferOutputUTXOIDs[0])

//   output = secpXferUtxo.getOutput() as AmountOutput
//   amt = output.getAmount().clone()
//   txid = secpXferUtxo.getTxID()
//   outputidx = secpXferUtxo.getOutputIdx()

//   secpTransferInput = new SECPTransferInput(amt)
//   secpTransferInput.addSignatureIdx(0, xAddresses[0])

//   transferableInput = new TransferableInput(txid, outputidx, assetID, secpTransferInput)
//   ins.push(transferableInput)

//   secpXferOutputUTXOIDs = getUTXOIDs(utxoSet, id2, AVMConstants.SECPXFEROUTPUTID, id)
//   secpXferUtxo = utxoSet.getUTXO(secpXferOutputUTXOIDs[0])

//   output = secpXferUtxo.getOutput() as AmountOutput
//   amt = output.getAmount().clone()
//   txid = secpXferUtxo.getTxID()
//   outputidx = secpXferUtxo.getOutputIdx()

//   let vcapBalance: BN = amt.sub(vcapAmount)

//   changeSecpTransferOutput = new SECPTransferOutput(vcapBalance, xAddresses, locktime, threshold)
//   changeTransferableOutput =  new TransferableOutput(bintools.cb58Decode(id), changeSecpTransferOutput)
//   outs.push(changeTransferableOutput)

//   secpTransferInput = new SECPTransferInput(amt)
//   secpTransferInput.addSignatureIdx(0, xAddresses[0])

//   transferableInput = new TransferableInput(txid, outputidx, bintools.cb58Decode(id), secpTransferInput)
//   ins.push(transferableInput)
//   const baseTx: BaseTx = new BaseTx(networkID, blockchainID, outs, ins, memo)
//   unsignedTx = new UnsignedTx(baseTx)
//   tx = unsignedTx.sign(xKeychain)
//   // console.log(tx.toBuffer().toString('hex'))
//   let id3: string = await avm.issueTx(tx)
//   console.log(id3)
// }
  
// main()
