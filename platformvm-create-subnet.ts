// import { Avalanche, BinTools, BN, Buffer } from "avalanche"
// import { 
//   AmountOutput,
//   PlatformVMAPI,
//   PlatformVMConstants,
//   KeyChain,
//   SECPTransferInput,
//   SECPOwnerOutput,
//   SECPTransferOutput,
//   TransferableInput,
//   TransferableOutput,
//   Tx, 
//   UnsignedTx,
//   UTXO,
//   UTXOSet,
//   CreateSubnetTx,
// } from "avalanche/dist/apis/platformvm"
// import { Defaults } from "avalanche/dist/utils/constants"

// const ip: string = "localhost"
// const protocol: string = "http"
// const networkID: number = 12345
// const port: number = 9650
// const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
// const bintools: BinTools = BinTools.getInstance()
// const platformvm: PlatformVMAPI = avalanche.PChain()
// const blockchainID: Buffer = bintools.cb58Decode(platformvm.getBlockchainID())
// const pKeychain: KeyChain = platformvm.keyChain()
// const memo: Buffer = bintools.stringToBuffer("AvalancheJS")
// pKeychain.importKey("PrivateKey-")
// const pAddresses: Buffer[] = platformvm.keyChain().getAddresses()
// const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()
// console.log(pAddressStrings)
// const locktime: BN = new BN(0)
// const threshold: number = 1
// const ins: TransferableInput[] = []
// const outs: TransferableOutput[] = []

// const main = async (): Promise<any> => {
//   const assetID: Buffer = await platformvm.getAVAXAssetID()
//   const result: any = await platformvm.getBalance(pAddressStrings[0])
//   const balance: BN = new BN(result.balance)
//   const fee: BN = platformvm.getFee()
//   const p: any = Defaults.network[4].P
//   const stakeAmount: BN = p.minStake
//   const avaxAmount: BN = balance.sub(fee).sub(stakeAmount)

//   const utxoSet: UTXOSet = await platformvm.getUTXOs([pAddressStrings[0]])
//   const utxo: UTXO = utxoSet.getAllUTXOs()[0]
//   const amountOutput: AmountOutput = utxo.getOutput() as AmountOutput
//   const amt: BN = amountOutput.getAmount().clone()
//   const txid: Buffer = utxo.getTxID()
//   const outputidx: Buffer = utxo.getOutputIdx()

//   const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(avaxAmount, pAddresses, locktime, threshold)
//   const transferableOutput: TransferableOutput =  new TransferableOutput(assetID, secpTransferOutput)
//   outs.push(transferableOutput)

//   const platformVMSecpInput: SECPTransferInput = new SECPTransferInput(amt)
//   platformVMSecpInput.addSignatureIdx(0, pAddresses[0])

//   const transferableInput: TransferableInput = new TransferableInput(txid, outputidx, assetID, platformVMSecpInput)
//   ins.push(transferableInput)

//   const rewardOutputOwners: SECPOwnerOutput = new SECPOwnerOutput(pAddresses, locktime, threshold)
//   const createSubnetTx: CreateSubnetTx = new CreateSubnetTx(networkID, blockchainID, outs, ins, memo, rewardOutputOwners)
//   const unsignedTx: UnsignedTx = new UnsignedTx(createSubnetTx)
//   const tx: Tx = unsignedTx.sign(pKeychain)
//   const id: string = await platformvm.issueTx(tx)
//   console.log(id)
// }
  
// main()
