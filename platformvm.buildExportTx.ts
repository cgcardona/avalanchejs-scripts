import { Avalanche, BinTools, BN, Buffer } from "avalanche"
import { 
  AVMAPI, 
  KeyChain as AVMKeyChain,
  UTXOSet as AVMUTXOSet,
} from "avalanche/dist/apis/avm"

import {
  PlatformVMAPI, 
  KeyChain as PlatformVMKeyChain,
  Tx,
  UTXOSet as PlatformVMUTXOSet,
  UnsignedTx
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

interface PlatformVMU {
  numFetched: number
  utxos: PlatformVMUTXOSet 
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

let amount: BN = new BN(100000000000000)
const mstimeout: number = 3000

const main = async (): Promise<any> => {
  let memoStr: string = "Export AVAX from the P-Chain"
  let amtfee: BN = amount.add(avm.getTxFee());
  let memo: Buffer = bintools.stringToBuffer(memoStr)
  console.log(memoStr)

  let platformvmu: PlatformVMU = await platformvm.getUTXOs([pAddressStrings[0]])
  let platformVMUTXOSet: PlatformVMUTXOSet = platformvmu.utxos 
  memo = bintools.stringToBuffer(memoStr)
  let unsignedTx: UnsignedTx = await platformvm.buildExportTx(
    platformVMUTXOSet,
    amtfee,
    avm.getBlockchainID(),
    [xAddressStrings[0]],
    [pAddressStrings[0]],
    [pAddressStrings[0]],
    memo
  )

  let tx: Tx = unsignedTx.sign(platformvm.keyChain())
  let serialized: any = unsignedTx.serialize("display")
  console.log(JSON.stringify(serialized))
  let txid: string = await platformvm.issueTx(tx)
  await sleep(mstimeout)
  let status: any = await platformvm.getTxStatus(txid)
  console.log(status)
  if(status === 'Committed') {
    console.log(`${status}! TXID: ${txid}`)
  } else {
    console.log(`${status.status}! TXID: ${txid}`)
  }
  console.log("----------------------------")
}
  
main()

