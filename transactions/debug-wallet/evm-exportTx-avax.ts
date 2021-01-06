import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from "avalanche"
import {
  EVMAPI, 
  ExportTx,
  KeyChain,
  EVMInput,
  TransferableOutput,
  SECPTransferOutput,
  UnsignedTx,
  Tx
} from "avalanche/dist/apis/evm"
import {
  AVMAPI, 
  KeyChain as AVMKeyChain
} from "avalanche/dist/apis/avm"
      
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 5
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const cchain: EVMAPI = avalanche.CChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: AVMKeyChain = xchain.keyChain()
const privKey: string = "PrivateKey-"
const cKeychain: KeyChain = cchain.keyChain()
xKeychain.importKey(privKey)
cKeychain.importKey(privKey)
const xAddresses: Buffer[] = xchain.keyChain().getAddresses()
const cAddresses: Buffer[] = cchain.keyChain().getAddresses()
const xChainBlockchainIdStr: string = "2JVSBoinj9C2J33VntvzYtVJNZdN2NKiwwKjcumHUWEb5DbBrm"
const xChainBlockchainIdBuf: Buffer = bintools.cb58Decode(xChainBlockchainIdStr)
const cChainBlockchainIdStr: string = "yH8D7ThNJkxmtkuv2jgBa4P1Rn3Qpr4pPr7QYNfcdoS6k6HWp"
const cChainBlockchainIdBuf: Buffer = bintools.cb58Decode(cChainBlockchainIdStr)
const cHexAddress: string = "0xAAAB930204EBc80F5422c20079acca130D2021A3"
const evmInputs: EVMInput[] = []
const exportedOuts: TransferableOutput[] = []
const Web3 = require('web3');
const path: string = '/ext/bc/C/rpc'
const web3 = new Web3(`${protocol}://${ip}:${port}${path}`)
const threshold: number = 1
      
const main = async (): Promise<any> => {
  const avaxAssetIDBuf: Buffer = await xchain.getAVAXAssetID()
  const avaxAssetIDStr: string = bintools.cb58Encode(avaxAssetIDBuf)
  let balance: BN = await web3.eth.getBalance(cHexAddress)
  balance = new BN(balance.toString().substring(0, 10))
  const fee: BN = new BN(1000000)
  const txcount = await web3.eth.getTransactionCount(cHexAddress)
  const nonce: number = txcount;
  const locktime: BN = new BN(0)
  
  const evmInput: EVMInput = new EVMInput(cHexAddress, balance, avaxAssetIDStr, nonce)
  evmInput.addSignatureIdx(0, cAddresses[0])
  evmInputs.push(evmInput)
  
  const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(balance.sub(fee), xAddresses, locktime, threshold)
  const transferableOutput: TransferableOutput = new TransferableOutput(avaxAssetIDBuf, secpTransferOutput)
  exportedOuts.push(transferableOutput)
  
  const exportTx: ExportTx = new ExportTx(
    networkID,
    cChainBlockchainIdBuf,
    xChainBlockchainIdBuf,
    evmInputs,
    exportedOuts
  )
    
  const unsignedTx: UnsignedTx = new UnsignedTx(exportTx)
  const tx: Tx = unsignedTx.sign(cKeychain)
  const id: string = await cchain.issueTx(tx)
  console.log(id)
}
    
main()