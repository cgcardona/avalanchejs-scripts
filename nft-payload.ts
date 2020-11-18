import { Avalanche, BinTools, BN, Buffer } from "avalanche"
import { UnixNow } from 'avalanche/dist/utils'
import { InfoAPI } from "avalanche/dist/apis/info"
import { 
  AVMAPI, 
  KeyChain as AVMKeyChain,
  Tx as AVMTx,
  UTXOSet as AVMUTXOSet,
  UnsignedTx as AVMUnsignedTx,
} from "avalanche/dist/apis/avm"

import {
  PlatformVMAPI, 
  KeyChain as PlatformVMKeyChain,
  Tx as PlatformVMTx,
  UTXO as PlatformUTXO,
  UTXOSet as PlatformVMUTXOSet,
  UnsignedTx as PlatformVMUnsignedTx,
  AmountOutput
} from "avalanche/dist/apis/platformvm"
import { Output } from "avalanche/dist/common"

import {
    PayloadBase,
    URLPayload
  } from "avalanche/dist/utils"

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
const privKey: string = "PrivateKey-"
xKeychain.importKey(privKey)
pKeychain.importKey(privKey)
const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
console.log(xAddressStrings)
const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()
console.log(pAddressStrings)

const main = async (): Promise<any> => {
  const urlPayload: string = "https://i.imgur.com/7kckXYl.jpg"
  const payload: PayloadBase = new URLPayload(urlPayload)
  console.log(payload.getPayload().toString('hex'))
}
  
main()

