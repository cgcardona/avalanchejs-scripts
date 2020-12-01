import { 
    Avalanche, 
    BN
  } from "avalanche"
  import {
    EVMAPI,
    KeyChain as EVMKeyChain
  } from "avalanche/dist/apis/evm"
  import { privKey } from '../common/values'
    
  const ip: string = "localhost"
  const port: number = 9650
  const protocol: string = "http"
  const networkID: number = 12345
  const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
  const cchain: EVMAPI = avalanche.CChain()
  const cKeychain: EVMKeyChain = cchain.keyChain()
  cKeychain.importKey(privKey)
  const cAddressStrings: string[] = cchain.keyChain().getAddressStrings()
    
  const main = async (): Promise<any> => {
    console.log(cAddressStrings)
  }
    
  main()
  