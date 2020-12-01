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
  const address: string = await cchain.importKey("gabr13l", "i224rjEezt", privKey)
  console.log(address)
}
  
main()
