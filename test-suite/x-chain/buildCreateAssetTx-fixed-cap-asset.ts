import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from "avalanche"
import {
  AVMAPI,
  AVMConstants,
  KeyChain,
  InitialStates,
  SECPTransferOutput,
  Tx,
  UnsignedTx,
  UTXOSet
} from "avalanche/dist/apis/avm"
import sleep from '../common/sleep'
import { AVMU } from '../common/interfaces'
import { privKey, mstimeout } from '../common/values'

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
const amount: BN = new BN(54321)
const name: string = "Fixed cap asset"
const symbol: string = "FIXC"
const denomination: number = 9
const locktime: BN = new BN(0)
const threshold: number = 1
const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(amount, addresses, locktime, threshold)
const initialState: InitialStates = new InitialStates()
initialState.addOutput(secpTransferOutput, AVMConstants.SECPFXID)
  
const main = async (): Promise<any> => {
  const avmu: AVMU = await xchain.getUTXOs(addressStrings)
  const utxoSet: UTXOSet = avmu.utxos 
  const memoStr: string = "AVM Build Create Asset Tx - Fixed Cap Asset"
  const memo: Buffer = bintools.stringToBuffer(memoStr)
  const unsignedTx: UnsignedTx = await xchain.buildCreateAssetTx(
      utxoSet,
      addressStrings,
      addressStrings,
      initialState,
      name,
      symbol,
      denomination,
      undefined,
      memo
  )
  const tx: Tx =  unsignedTx.sign(xKeychain)
  const txid: string = await xchain.issueTx(tx)
  await sleep(mstimeout)
  const status : string = await xchain.getTxStatus(txid)
  console.log(`${status}! TXID: ${txid}`)
  console.log("----------------------------")
}
  
main()
