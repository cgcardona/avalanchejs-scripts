import { 
  Avalanche
} from "avalanche"
import {
  EVMAPI
} from "avalanche/dist/apis/evm"
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const cchain: EVMAPI = avalanche.CChain()
  
const main = async (): Promise<any> => {
  const txid: any = await cchain.importAVAX("gabr13l", "2if3ZlOfZ7", "0xCD5C1f9B15DF1B2a49F9F3491A63A91d08D6c962", "X")
  console.log(txid)
}
  
main()
