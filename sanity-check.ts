import { 
  Avalanche, 
  Buffer 
} from "avalanche"
import { 
  KeyChain, 
  AVMAPI, 
  UTXO
} from "avalanche/dist/apis/avm"

const networkID: number = 12345
const ip: string = 'localhost'
const port: number = 9650
const protocol: string = 'http'
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const xKeychain: KeyChain = xchain.keyChain()
const senderPrivateKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
xKeychain.importKey(senderPrivateKey)

const main = async (): Promise<any> => {
  const utxoStr: string = "128xD6CUwiLq7F7bjaUq2PJpV9cUV5YGNLn5eAgcRbYtUhkojxF8N2gVTDcXnH83afrq2W14GnJjDAWzP6i7yVUcAfE3gdtaVTemtia17Cp6hznekfApoxy7NB3z9msyEA7WDzwRsfoPRfd5GrJLV5eDyucyBnkwaUDMgn"
  const utxo: UTXO = new UTXO()
  utxo.fromString(utxoStr)
  console.log(utxo)
}
  
main()
