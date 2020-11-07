import { Avalanche, BinTools, BN } from "avalanche"
import { Buffer } from 'buffer/'
import { 
  AVMAPI, 
  AVMConstants, 
  KeyChain, 
  InitialStates, 
  SECPTransferOutput,
  SECPMintOutput,
  Tx, 
  UnsignedTx,
  UTXOSet
} from "avalanche/dist/apis/avm"

const sleep = (ms: number): Promise<unknown> => {
  return new Promise( resolve => setTimeout(resolve, ms) )
}

interface AVMU {
  numFetched: number
  utxos: UTXOSet
  endIndex: {
    address: string
    utxo: string
  }
}

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: KeyChain = xchain.keyChain()
const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
xKeychain.importKey(privKey)
const addresses: Buffer[] = xchain.keyChain().getAddresses()
const addressStrings: string[] = xchain.keyChain().getAddressStrings()
const amount: BN = new BN(54321)
const name: string = "Variable Capped Asset"
const symbol: string = "VARC"
const denomination: number = 9
const locktime: BN = new BN(0)
const threshold: number = 1
const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(amount, addresses, locktime, threshold)
const secPMintOutput: SECPMintOutput = new SECPMintOutput(addresses, locktime, threshold)
const initialState: InitialStates = new InitialStates()
initialState.addOutput(secpTransferOutput, AVMConstants.SECPFXID)
const mstimeout: number = 3000
  
const main = async (): Promise<any> => {
  const avmu: AVMU = await xchain.getUTXOs(addressStrings)
  const utxoSet: UTXOSet = avmu.utxos 
  const memoStr: string = "AVM Build Create Asset Tx - Variable Cap Asset"
  const memo: Buffer = bintools.stringToBuffer(memoStr)
  const unsignedTx: UnsignedTx = await xchain.buildCreateAssetTx(
      utxoSet,
      addressStrings,
      addressStrings,
      initialState,
      name,
      symbol,
      denomination,
      [secPMintOutput],
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
