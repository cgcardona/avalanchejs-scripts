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
  CreateAssetTx,
  InitialStates,
  MinterSet,
  AVMConstants,
  NFTMintOutput
} from "avalanche/dist/apis/avm"
import { 
  iGetBalanceResponse, 
  iAVMUTXOResponse 
} from "avalanche/dist/apis/avm/interfaces"
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
const outputs: TransferableOutput[] = []
const inputs: TransferableInput[] = []
const fee: BN = xchain.getDefaultTxFee()
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = bintools.stringToBuffer("AVM manual CreateAssetTx to create an NFT")
const name: string = "non fungible token" 
const symbol: string = "NFT" 
const denomination: number = 0 // NFTs are non-fungible
const groupID: number = 0
    
const main = async (): Promise<any> => {
  const avaxAssetID: Buffer = await xchain.getAVAXAssetID()
  const getBalanceResponse: iGetBalanceResponse = await xchain.getBalance(xAddressStrings[0], bintools.cb58Encode(avaxAssetID))
  const balance: BN = new BN(getBalanceResponse.balance)
  const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(balance.sub(fee), xAddresses, locktime, threshold)
  const transferableOutput: TransferableOutput = new TransferableOutput(avaxAssetID, secpTransferOutput)
  outputs.push(transferableOutput)

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

  const initialStates: InitialStates = new InitialStates()
  const minterSets: MinterSet[] = [new MinterSet(threshold, xAddresses)]
  const nftMintOutput: NFTMintOutput = new NFTMintOutput(
    groupID,
    minterSets[0].getMinters(),
    locktime, 
    minterSets[0].getThreshold()
  )
  initialStates.addOutput(nftMintOutput, AVMConstants.NFTFXID)

  const createAssetTx: CreateAssetTx = new CreateAssetTx(
    networkID,
    bintools.cb58Decode(blockchainid),
    outputs,
    inputs,
    memo,
    name,
    symbol,
    denomination,
    initialStates
  )
  const unsignedTx: UnsignedTx = new UnsignedTx(createAssetTx)
  const tx: Tx = unsignedTx.sign(xKeychain)
  const id: string = await xchain.issueTx(tx)
  console.log(id)
}
  
main()
  