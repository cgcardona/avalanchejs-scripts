import { Avalanche, BinTools, BN, Buffer } from "avalanche"
import { UnixNow } from 'avalanche/dist/utils'
import { InfoAPI } from "avalanche/dist/apis/info"
import { 
  ContractVMAPI, 
  KeyChain,
} from "avalanche/dist/apis/contractvm"

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

const ip: string = "localhost"
const protocol: string = "http"
const networkID: number = 12345
const port: number = 9650
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const bintools: BinTools = BinTools.getInstance()
const cvm: ContractVMAPI = avalanche.CChain()
const cKeychain: KeyChain = cvm.keyChain()
const privKey: string = "PrivateKey-"
cKeychain.importKey(privKey)
console.log(cvm)
const cAddressStrings: string[] = cKeychain.getAddressStrings()
console.log(cAddressStrings)
// const avm: AVMAPI = avalanche.XChain()
// const platformvm: PlatformVMAPI= avalanche.PChain()
// const xKeychain: AVMKeyChain = avm.keyChain()
// const pKeychain: PlatformVMKeyChain = platformvm.keyChain()
// const privKey: string = "PrivateKey-"
// xKeychain.importKey(privKey)
// pKeychain.importKey(privKey)
// const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
// // console.log(xAddressStrings)
// const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()
// // console.log(pAddressStrings)
// let amount: BN = new BN(100000000000000)
// const info: InfoAPI = avalanche.Info()
// const mstimeout: number = 5000

const main = async (): Promise<any> => { }
  
main()

