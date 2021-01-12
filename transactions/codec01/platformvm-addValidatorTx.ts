import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from "avalanche"
import {
  PlatformVMAPI,
  KeyChain,
  SECPTransferOutput,
  SECPTransferInput,
  TransferableOutput,
  TransferableInput,
  UTXOSet,
  UTXO,
  AmountOutput,
  UnsignedTx,
  Tx,
  CreateSubnetTx,
  SECPOwnerOutput,
  AddValidatorTx,
  ParseableOutput
} from "avalanche/dist/apis/platformvm"
import { Defaults, UnixNow } from "avalanche/dist/utils"
import { iPlatformVMUTXOResponse, iGetBalanceResponse, iGetMinStakeResponse } from "avalanche/dist/apis/platformvm/interfaces"
import { Output } from "avalanche/dist/common"
    
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const pchain: PlatformVMAPI = avalanche.PChain()
const bintools: BinTools = BinTools.getInstance()
const pKeychain: KeyChain = pchain.keyChain()
const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
pKeychain.importKey(privKey)
const pAddresses: Buffer[] = pchain.keyChain().getAddresses()
const pAddressStrings: string[] = pchain.keyChain().getAddressStrings()
const pChainBlockchainID: string = Defaults.network['12345'].P.blockchainID
const outputs: TransferableOutput[] = []
const inputs: TransferableInput[] = []
const stakeOuts: TransferableOutput[] = []
const fee: BN = pchain.getDefaultTxFee()
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = bintools.stringToBuffer("Manually add a validator to the primary subnet")
const nodeID: string = "DueWyGi3B9jtKfa9mPoecd4YSDJ1ftF69"
const startTime: BN = UnixNow().add(new BN(60 * 1))
const endTime: BN = new BN(1636290548)
// const endTime: BN = startTime.add(new BN(1209600))
const delegationFee: number = 10
 
const main = async (): Promise<any> => {
  const stakeAmount: iGetMinStakeResponse = await pchain.getMinStake()
  const avaxAssetID: Buffer = await pchain.getAVAXAssetID()
  const getBalanceResponse: iGetBalanceResponse = await pchain.getBalance(pAddressStrings[0])
  const unlocked: BN = new BN(getBalanceResponse.unlocked)
  const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(unlocked.sub(fee).sub(stakeAmount.minValidatorStake), pAddresses, locktime, threshold)
  const transferableOutput: TransferableOutput = new TransferableOutput(avaxAssetID, secpTransferOutput)
  outputs.push(transferableOutput)

  const stakeSECPTransferOutput: SECPTransferOutput = new SECPTransferOutput(stakeAmount.minValidatorStake, pAddresses, locktime, threshold)
  const stakeTransferableOutput: TransferableOutput =  new TransferableOutput(avaxAssetID, stakeSECPTransferOutput)
  stakeOuts.push(stakeTransferableOutput)

  const rewardOutputOwners: SECPOwnerOutput = new SECPOwnerOutput(pAddresses, locktime, threshold)
  const rewardOwners: ParseableOutput = new ParseableOutput(rewardOutputOwners)

  const platformVMUTXOResponse: iPlatformVMUTXOResponse = await pchain.getUTXOs(pAddressStrings)
  const utxoSet: UTXOSet = platformVMUTXOResponse.utxos
  const utxos: UTXO[] = utxoSet.getAllUTXOs()
  utxos.forEach((utxo: UTXO) => {
    const output: Output = utxo.getOutput()
    if(output.getOutputID() === 7) {
      const amountOutput: AmountOutput = utxo.getOutput() as AmountOutput
      const amt: BN = amountOutput.getAmount().clone()
      const txid: Buffer = utxo.getTxID()
      const outputidx: Buffer = utxo.getOutputIdx()

      const secpTransferInput: SECPTransferInput = new SECPTransferInput(amt)
      secpTransferInput.addSignatureIdx(0, pAddresses[0])

      const input: TransferableInput = new TransferableInput(txid, outputidx, avaxAssetID, secpTransferInput)
      inputs.push(input)
    }
  })

  const addValidatorTx: AddValidatorTx = new AddValidatorTx(
    networkID,
    bintools.cb58Decode(pChainBlockchainID),
    outputs,
    inputs,
    memo,
    bintools.cb58Decode(nodeID),
    startTime,
    endTime,
    stakeAmount.minValidatorStake,
    stakeOuts,
    rewardOwners,
    delegationFee
  )
  const unsignedTx: UnsignedTx = new UnsignedTx(addValidatorTx)

  // start uncomment for codecID 00 00
  const tx: Tx = unsignedTx.sign(pKeychain)
  const id: string = await pchain.issueTx(tx)
  // stop uncomment for codecID 00 00

  // start uncomment for codecID 00 01
  // const codecID: number = 1
  // const tx: Tx = unsignedTx.sign(xKeychain, codecID)
  // const cb58EncodedTx: string = bintools.cb58Encode(tx.toBuffer(codecID))
  // const id: string = await xchain.issueTx(cb58EncodedTx)
  // stop uncomment for codecID 00 01

  console.log(id)
}
  
main()
  