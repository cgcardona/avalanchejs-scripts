import { 
  Avalanche
} from "avalanche"
import {
  EVMInput,
  EVMAPI
} from "avalanche/dist/apis/evm"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
// const xchain: AVMAPI = avalanche.XChain()
  
const main = async (): Promise<any> => {
  // const txid: any = await xchain.import("gabr13l", "i224rjEezt", "X-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u", "C")
  // console.log(txid)
  const evmInput: EVMInput = new EVMInput()
  console.log(evmInput)
  console.log(evmInput.toBuffer().toString('hex'))
  console.log(evmInput.toString())
  console.log(evmInput.fromBuffer(evmInput.toBuffer()))
}
  
main()
