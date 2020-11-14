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
  const address: string = "C-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u"
  const u: any = await cchain.getUTXOs(address, "X")
  const utxos = u.utxos
  console.log(utxos.getAllUTXOStrings())
  console.log("----------------------------")
}
  
main()
