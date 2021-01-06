import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from "avalanche"
import {
  EVMAPI, 
  EVMOutput, 
  ImportTx,
  TransferableInput,
  KeyChain,
  UTXO,
  UTXOSet,
  SECPTransferInput,
  AmountOutput
} from "avalanche/dist/apis/evm"
import { 
  UnsignedTx 
} from "avalanche/dist/apis/evm"
import { 
  Tx 
} from "avalanche/dist/apis/evm"
      
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 5 
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const cchain: EVMAPI = avalanche.CChain()
const bintools: BinTools = BinTools.getInstance()
const cKeychain: KeyChain = cchain.keyChain()
const cHexAddress: string = "0xAAAB930204EBc80F5422c20079acca130D2021A3"
const privKey: string = "PrivateKey-"
cKeychain.importKey(privKey)
const cAddresses: Buffer[] = cchain.keyChain().getAddresses()
const cAddressStrings: string[] = cchain.keyChain().getAddressStrings()
const cChainBlockchainIdStr: string = "yH8D7ThNJkxmtkuv2jgBa4P1Rn3Qpr4pPr7QYNfcdoS6k6HWp"
const cChainBlockchainIdBuf: Buffer = bintools.cb58Decode(cChainBlockchainIdStr)
const xChainBlockchainIdStr: string = "2JVSBoinj9C2J33VntvzYtVJNZdN2NKiwwKjcumHUWEb5DbBrm"
const xChainBlockchainIdBuf: Buffer = bintools.cb58Decode(xChainBlockchainIdStr)
const importedIns: TransferableInput[] = []
const evmOutputs: EVMOutput[] = []
      
const main = async (): Promise<any> => {
  const u: any = await cchain.getUTXOs(cAddressStrings[0], "X")
  const utxoSet: UTXOSet = u.utxos
  const utxo: UTXO = utxoSet.getAllUTXOs()[0]
  const assetID: Buffer = utxo.getAssetID() 
  const txid: Buffer = utxo.getTxID()
  const outputidx: Buffer = utxo.getOutputIdx()
  const output: AmountOutput = utxo.getOutput() as AmountOutput
  const amt: BN = output.getAmount().clone()
  
  const input: SECPTransferInput = new SECPTransferInput(amt)
  input.addSignatureIdx(0, cAddresses[0])
  const xferin: TransferableInput = new TransferableInput(txid, outputidx, assetID, input)
  importedIns.push(xferin)
  
  const evmOutput: EVMOutput = new EVMOutput(cHexAddress, amt, assetID)
  evmOutputs.push(evmOutput)
  const importTx: ImportTx = new ImportTx(
    networkID,
    cChainBlockchainIdBuf,
    xChainBlockchainIdBuf,
    importedIns,
    evmOutputs
  )
  const unsignedTx: UnsignedTx = new UnsignedTx(importTx)
  const tx: Tx = unsignedTx.sign(cKeychain)
  const id: string = await cchain.issueTx(tx)
  console.log(id)
}
    
main()