import { Avalanche, BinTools, BN } from "avalanche"
import {
  PlatformVMAPI, 
  PlatformVMKeyChain,
} from "avalanche/dist/apis/platformvm";

// consts
const mstimeout: number = 2000;
const ip: string = "localhost"
const protocol: string = "http"
const networkID: number = 12345
const port: number = 9650
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const platformvm: PlatformVMAPI= avalanche.PChain()
const pKeychain: PlatformVMKeyChain = platformvm.keyChain()
pKeychain.importKey("PrivateKey-")
const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()
console.log(pAddressStrings)

const main = async (): Promise<any> => {
}
  
main()