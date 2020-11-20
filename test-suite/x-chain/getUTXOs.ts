import { 
  Avalanche
} from "avalanche"
import {
  AVMAPI,
  UTXOSet
} from "avalanche/dist/apis/avm"
import { AVMU } from '../common/interfaces'
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()

const main = async (): Promise<any> => {
  const sourceChain: string = "X"
  const address: string = `${sourceChain}-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u`
  const avmu: AVMU = await xchain.getUTXOs(address, sourceChain)
  const utxos: UTXOSet = avmu.utxos
  console.log(utxos.getAllUTXOStrings())
  console.log("----------------------------")
}
  
main()
