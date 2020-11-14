import { 
  Avalanche
} from "avalanche"
import { KeystoreAPI } from "avalanche/dist/apis/keystore"
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const keystore: KeystoreAPI = avalanche.NodeKeys()
  
const main = async (): Promise<any> => {
  const confirmed: boolean = await keystore.createUser("gabr13l", "i224rjEezt")
  console.log(confirmed)
}
  
main()
