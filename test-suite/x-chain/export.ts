import { 
  Avalanche,
  BN
} from "avalanche"
import {
  AVMAPI
} from "avalanche/dist/apis/avm"
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
  
const main = async (): Promise<any> => {
  const txid: any = await xchain.export("gabr13l", "i224rjEezt", "C-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u", new BN(25), "25VGRrm9Kpf8SjHDRWktgYqAMkc6mTYKdR9DgVjXmzyjfiofbf")
  console.log(txid)
}
  
main()
