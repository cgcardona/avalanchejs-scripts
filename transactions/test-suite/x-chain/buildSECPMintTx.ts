import { 
  Avalanche, 
  BinTools, 
  BN,
  Buffer
} from "avalanche"
import {
  AVMAPI,
  AVMConstants,
  SECPMintOutput,
  SECPTransferOutput,
  KeyChain,
  Tx,
  UnsignedTx,
  UTXOSet,
  UTXO
} from "avalanche/dist/apis/avm"
import sleep from '../common/sleep'
import { AVMU } from '../common/interfaces'
import { privKey, mstimeout } from '../common/values'
import getUTXOIDs from '../common/getUTXOIDs'
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: KeyChain = xchain.keyChain()
xKeychain.importKey(privKey)
const addresses: Buffer[] = xchain.keyChain().getAddresses()
const addressStrings: string[] = xchain.keyChain().getAddressStrings()
  
const main = async (): Promise<any> => {
  const avmu: AVMU = await xchain.getUTXOs(addressStrings)
  const utxoSet: UTXOSet = avmu.utxos 
  const memoStr: string = "AVM Build SECP Mint Tx"
  const memo: Buffer = bintools.stringToBuffer(memoStr)
  const id: string = "2MiFEGVDAHm5dGCMNSmjjX5mFiSj8GRdDBELTW3twkqxzKSrZq"

  const secpMintOutputUTXOIDs: string[] = getUTXOIDs(utxoSet, id, AVMConstants.SECPMINTOUTPUTID, id)
  const mintUTXOID: string = secpMintOutputUTXOIDs[0]
  const utxo: UTXO = utxoSet.getUTXO(secpMintOutputUTXOIDs[0])
  const mintOwner: SECPMintOutput = utxo.getOutput() as SECPMintOutput
  const amount: BN = new BN(54321)
  const locktime: BN = new BN(0)
  const threshold: number = 1
  const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(amount, addresses, locktime, threshold)

  const unsignedTx: UnsignedTx = await xchain.buildSECPMintTx(
    utxoSet,
    mintOwner,
    secpTransferOutput,
    addressStrings,
    addressStrings,
    mintUTXOID,
    memo
  )
  const tx: Tx = unsignedTx.sign(xKeychain)
  const txid: string = await xchain.issueTx(tx)
  await sleep(mstimeout)
  const status : string = await xchain.getTxStatus(txid)
  console.log(`${status}! TXID: ${txid}`)
  console.log("----------------------------")
}
  
main()
