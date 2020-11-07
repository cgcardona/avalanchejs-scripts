import { Avalanche, BinTools, BN, Buffer } from "avalanche"
import { 
  AVMAPI, 
  KeyChain as AVMKeyChain,
  UTXOSet as AVMUTXOSet,
  Tx,
  UnsignedTx
} from "avalanche/dist/apis/avm"

import {
  KeyChain as PlatformVMKeyChain,
  PlatformVMAPI, 
} from "avalanche/dist/apis/platformvm"

const sleep = (ms: number): Promise<unknown> => {
  return new Promise( resolve => setTimeout(resolve, ms) )
}

interface AVMU {
  numFetched: number
  utxos: AVMUTXOSet
  endIndex: {
    address: string
    utxo: string
  }
}

const ip: string = "localhost"
const protocol: string = "http"
const networkID: number = 12345
const port: number = 9650
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const bintools: BinTools = BinTools.getInstance()
const avm: AVMAPI = avalanche.XChain()
const platformvm: PlatformVMAPI= avalanche.PChain()
const xKeychain: AVMKeyChain = avm.keyChain()
const pKeychain: PlatformVMKeyChain = platformvm.keyChain()
const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
xKeychain.importKey(privKey)
pKeychain.importKey(privKey)
const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
console.log(xAddressStrings)
const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()
console.log(pAddressStrings)

const amount: BN = new BN(100000000000000)
const mstimeout: number = 2000

const main = async (): Promise<any> => {
  const memoStr: string = "Export AVAX from the X-Chain"
  const amtfee: BN = amount.add(avm.getTxFee());
  const memo: Buffer = bintools.stringToBuffer(memoStr)
  console.log(memoStr)

  const avmu: AVMU = await avm.getUTXOs([xAddressStrings[0]])
  const avmUTXOSet: AVMUTXOSet = avmu.utxos 
  const unsignedTx: UnsignedTx = await avm.buildExportTx(
    avmUTXOSet,
    amtfee,
    platformvm.getBlockchainID(),
    [pAddressStrings[0]],
    [xAddressStrings[0]],
    [xAddressStrings[0]],
    memo
  )

  const tx: Tx = unsignedTx.sign(avm.keyChain())
  const txid: string = await avm.issueTx(tx)
  await sleep(mstimeout)
  const status: any = await avm.getTxStatus(txid)
  console.log(`${status}! TXID: ${txid}`)
}
  
main()
