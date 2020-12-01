import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from "avalanche"
import {
  EVMAPI,
  KeyChain
} from "avalanche/dist/apis/evm"
import { privKey, mstimeout } from '../common/values'
import { StakeableLockOut, UTXO } from "avalanche/dist/apis/platformvm"
import { UnixNow } from "avalanche/dist/utils"
console.log("-------------")
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const cchain: EVMAPI = avalanche.CChain()
const bintools: BinTools = BinTools.getInstance()
const cKeychain: KeyChain = cchain.keyChain()
cKeychain.importKey(privKey)
const addresses: Buffer[] = cchain.keyChain().getAddresses()
// console.log(addresses)
const addressStrings: string[] = cchain.keyChain().getAddressStrings()
// console.log(addressStrings)
  
const main = async (): Promise<any> => {
  const u: any = await cchain.getUTXOs(addressStrings[0], "X")
  // console.log(u)
  const utxos = u.utxos
  console.log(utxos.getAllUTXOStrings())
}
  
main()