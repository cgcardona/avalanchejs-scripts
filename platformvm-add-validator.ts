import { Avalanche, BinTools, BN, Buffer } from "avalanche"
import { 
  AddValidatorTx,
  AmountOutput,
  ParseableOutput,
  PlatformVMAPI,
  PlatformVMConstants,
  KeyChain,
  SECPTransferInput,
  SECPOwnerOutput,
  SECPTransferOutput,
  TransferableInput,
  TransferableOutput,
  Tx, 
  UnsignedTx,
  UTXO,
  UTXOSet,
} from "avalanche/dist/apis/platformvm"
import { Defaults, UnixNow } from "avalanche/dist/utils"

const ip: string = "localhost"
const protocol: string = "http"
const networkID: number = 12345
const port: number = 9650
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const bintools: BinTools = BinTools.getInstance()
const platformvm: PlatformVMAPI = avalanche.PChain()
const blockchainID: Buffer = bintools.cb58Decode(platformvm.getBlockchainID())
const pKeychain: KeyChain = platformvm.keyChain()
const memo: Buffer = bintools.stringToBuffer("Avalanche.js")
pKeychain.importKey("PrivateKey-")
const pAddresses: Buffer[] = platformvm.keyChain().getAddresses()
const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()
console.log(pAddressStrings)
const locktime: BN = new BN(0)
const threshold: number = 1
const ins: TransferableInput[] = []
const outs: TransferableOutput[] = []
const stakeOuts: TransferableOutput[] = []

const main = async (): Promise<any> => {
  let assetID: Buffer = await platformvm.getAVAXAssetID()
  let result: any = await platformvm.getBalance(pAddressStrings[0])
  let balance: BN = new BN(result.balance)
  let fee: BN = platformvm.getFee()
  const p: any = Defaults.network[4].P
  const stakeAmount: BN = p.minStake
  let avaxAmount: BN = balance.sub(fee).sub(stakeAmount)
  const startTime: BN = UnixNow().add(new BN(60))
  const endTime: BN = startTime.add(new BN(60 * 60 * 24 * 10))
  const nodeID: string = "5mb46qkSBj81k9g9e4VFjGGSbaaSLFRzD"
  const delegationFee: number = 10

  const utxoSet: UTXOSet = await platformvm.getUTXOs([pAddressStrings[0]])
  const utxo: UTXO = utxoSet.getAllUTXOs()[0]
  const amountOutput: AmountOutput = utxo.getOutput() as AmountOutput
  let amt: BN = amountOutput.getAmount().clone()
  const txid: Buffer = utxo.getTxID()
  const outputidx: Buffer = utxo.getOutputIdx()

  const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(avaxAmount, pAddresses, locktime, threshold)
  const transferableOutput: TransferableOutput =  new TransferableOutput(assetID, secpTransferOutput)
  outs.push(transferableOutput)

  const stakeSECPTransferOutput: SECPTransferOutput = new SECPTransferOutput(stakeAmount, pAddresses, locktime, threshold)
  const stakeTransferableOutput: TransferableOutput =  new TransferableOutput(assetID, stakeSECPTransferOutput)
  stakeOuts.push(stakeTransferableOutput)

  const platformVSECPTransferInput: SECPTransferInput = new SECPTransferInput(amt)
  platformVSECPTransferInput.addSignatureIdx(0, pAddresses[0])

  const transferableInput: TransferableInput = new TransferableInput(txid, outputidx, assetID, platformVSECPTransferInput)
  ins.push(transferableInput)

  const rewardOutputOwners: SECPOwnerOutput = new SECPOwnerOutput(pAddresses, locktime, threshold)
  const rewardOwners: ParseableOutput = new ParseableOutput(rewardOutputOwners)
  const addValidatorTx: AddValidatorTx = new AddValidatorTx(networkID, blockchainID, outs, ins, memo, bintools.cb58Decode(nodeID), startTime, endTime, stakeAmount, stakeOuts, rewardOwners, delegationFee)
  const unsignedTx: UnsignedTx = new UnsignedTx(addValidatorTx)
  const tx: Tx = unsignedTx.sign(pKeychain)
  const id: string = await platformvm.issueTx(tx)
  console.log(id)
}
  
main()
