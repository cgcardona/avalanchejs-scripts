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
  SECPTransferOutput
} from "avalanche/dist/apis/evm"
import {
  AVMAPI, 
  KeyChain as AVMKeyChain
} from "avalanche/dist/apis/avm"
import { privKey } from '../common/values'
import { UnsignedTx } from "avalanche/dist/apis/evm"
import { Tx } from "avalanche/dist/apis/evm"
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const cchain: EVMAPI = avalanche.CChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: AVMKeyChain = xchain.keyChain()
const cKeychain: KeyChain = cchain.keyChain()
xKeychain.importKey(privKey)
cKeychain.importKey(privKey)
const xAddresses: Buffer[] = xchain.keyChain().getAddresses()
const cAddresses: Buffer[] = cchain.keyChain().getAddresses()
const blockchainid: string = "26sSDdFXoKeShAqVfvugUiUQKhMZtHYDLeBqmBfNfcdjziTrZA"
const destinationChain: string = "2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed"
const secpAssetID: string = "2nzgmhZLuVq8jc7NNu2eahkKwoJcbFWXWJCxHBVWAJEZkhquoK"
const avaxAssetID: string = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"
const cETHAddress: string = "8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC"
const inputs: EVMInput[] = []
const exportedOuts: TransferableOutput[] = []
const Web3 = require('web3');
const web3 = new Web3("http://localhost:9650/ext/bc/C/rpc");
  
const main = async (): Promise<any> => {
  let threshold: number = 1;
  let secpAmount: BN = new BN(25)
  let avaxAmount1: BN = new BN(4000001000000)
  let avaxAmount2: BN = new BN(4000000000000)
  let txcount = await web3.eth.getTransactionCount('0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC')
  const nonce: number = txcount;
  const locktime: BN = new BN(0)
  const input: EVMInput = new EVMInput(cETHAddress, secpAmount, secpAssetID, nonce);
  input.addSignatureIdx(0, cAddresses[0])
  inputs.push(input)
  const input2: EVMInput = new EVMInput(cETHAddress, avaxAmount1, avaxAssetID, nonce);
  input2.addSignatureIdx(0, cAddresses[0])
  inputs.push(input2)
  const secpOutput2: SECPTransferOutput = new SECPTransferOutput(avaxAmount2, xAddresses, locktime, threshold)
  const o2: TransferableOutput = new TransferableOutput(bintools.cb58Decode(avaxAssetID), secpOutput2)
  exportedOuts.push(o2)
  const secpOutput1: SECPTransferOutput = new SECPTransferOutput(secpAmount, xAddresses, locktime, threshold)
  const o1: TransferableOutput = new TransferableOutput(bintools.cb58Decode(secpAssetID), secpOutput1)
  exportedOuts.push(o1)
  const exportTx: ExportTx = new ExportTx(
    networkID,
    bintools.cb58Decode(blockchainid),
    bintools.cb58Decode(destinationChain),
    inputs,
    exportedOuts
  )
  console.log(exportTx.toBuffer().toString('hex'))
  console.log('--')

  const exportTx2: ExportTx = new ExportTx()
  exportTx2.fromBuffer(exportTx.toBuffer())
  console.log(exportTx2.toBuffer().toString('hex'))
  // const unsignedTx: UnsignedTx = new UnsignedTx(exportTx)
  // const tx: Tx = unsignedTx.sign(cKeychain)
  // console.log(tx.toBuffer().toString('hex'))
  // const id: string = await cchain.issueTx(tx)
  // console.log(id)
}

main()