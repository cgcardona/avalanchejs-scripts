import { Avalanche, BinTools, BN } from "avalanche"
import { Buffer } from 'buffer/'
import { 
  AVMAPI, 
  KeyChain as AVMKeyChain
} from "avalanche/dist/apis/avm"
import {
  PlatformVMAPI, 
  KeyChain as PlatformVMKeyChain,
} from "avalanche/dist/apis/platformvm";
const ip: string = "localhost"
const protocol: string = "http"
const networkID: number = 12345
const port: number = 9650
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const avm: AVMAPI = avalanche.XChain()
const platformvm: PlatformVMAPI= avalanche.PChain()
const xKeychain: AVMKeyChain = avm.keyChain()
const pKeychain: PlatformVMKeyChain = platformvm.keyChain()
xKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
pKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()
console.log(xAddressStrings)
console.log(pAddressStrings)