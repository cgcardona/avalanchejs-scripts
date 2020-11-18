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

const sleep = (ms: number): Promise<unknown> => {
  return new Promise( resolve => setTimeout(resolve, ms) )
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
  // let hex: string = await avm.getTx('2CiVMmk7Uk1SaKzYYkrbQjiBbd7rDBUocNjpzUJxhsJ27ezJcF')
  // console.log(hex)
  // let cb58: string = await avm.getTx('2CiVMmk7Uk1SaKzYYkrbQjiBbd7rDBUocNjpzUJxhsJ27ezJcF', 'cb58')
  // console.log(cb58)
  let foo = bintools.cb58Decode("111111112Q7d6PDowbCqrLBWrvZBTmjaPvBsLqmuFqqXkQpHS4QqxuRXLPogdymnpSv3Pj9pVRnfgFisTRotau4H1Loxh9RCbU66zpxk5n2SHLEfQDqoQyoDtVrhcKgLeakYPqYiajQRSfWJp379P3jihQCM5LRdTVWb3H5wMpsTCjqBBX1T5cPmamwdgjwBf62LdWzzdw653EgfLQvhug5yvgyQbbNqMvta9wHeYqLx3NVRUwsMiiu5fjjjhbf6Keiyno4XyPTC4RctzQvb4xF5t54QQCqcUEZvAuQBvHAPgNqTaUMJMK3fDeXMQbHTrqxcNYtqHUr1s6MxhAeCi61oseWXwnis8358Y85RR7eobZcVCVBRbW8Vj7LtmkX5oADxzZ4QvAYz9tNuxkU7rTgNqNUY8BSi2TdV2KTdzg5NDouLub7VqRWqsJFAFV2cS4wAxmoej9EfjGMhKSujvQXVV5Qub31SQ3HEdCMWmCycfshMAkCFAXqTNvpeWZUGYDBLZydNbjgkXoijqY641RSs6GEzHwB7MQXCAyCgbMBfPvXUPNPquFAt2jQXgUkQAehUP7ErLYNXJ8jjxFJg3jpthBTifeYhCmaaN4k8YdQkNEKUrkpFZjVwjrozbnY5KshevJpjZ")
  console.log(foo.toString('hex'))
}
  
main()

