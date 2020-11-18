import { 
  Avalanche
} from "avalanche"
import {
  EVMAPI
} from "avalanche/dist/apis/evm"
import { privKey } from '../common/values'
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const cchain: EVMAPI = avalanche.CChain()
  
const main = async (): Promise<any> => {
  const privKey: string = await cchain.exportKey("", "", "")
  console.log(privKey)
}
  
main()
